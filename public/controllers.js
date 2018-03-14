var chattControllers = angular.module('chattControllers', []);

chattControllers.controller('listController', ['$scope', '$location',  'HttpService', 'UserService', 'socket',
  function($scope, $location, http, user, socket) {

    $scope.added = "";
    $scope.rooms = [];
    $scope.catnames = [];
    $scope.alerts = [];
    $scope.categories = [];

    socket.init();


    $scope.addAlert = function(name, catname) {
        $scope.alerts.splice(0); 
        $scope.alerts.push({ name: name, catname: catname, msg: 'Well done! You successfully read this important alert message.' });
    };


    var userInterests = user.getInterests();
    for (category in userInterests){
      console.log("joining room " + userInterests[category]);
      socket.emit("join", {name: userInterests[category]}, function() {
        $scope.rooms = [];
      });
    }


    http.get("/roomlist", function(data) {
      /*hämtar data.room_list från eventdb, innehåller alla loppisevent i databasen
      category_name har bundits till attributet category_ids i eventdb */
      $scope.rooms = data.room_list;
      for (var i = 0; i<data.room_list.length; i++) {
        /* gör en array catnames för att plocka ut category_names för alla category_ids i
        eventdb-stanserna. loppisen med index j i rooms-arrayen hittar sina category_names i
        catnames index j */
        $scope.catnames[i] = [];
        for (var j = 0; j<data.room_list[i].category_ids.length; j++) {
          $scope.catnames[i] += data.room_list[i].category_ids[j].category_name + " ";
        }
      }
    });

    http.get("/categorylist", function(data) {
      for (var i = 0; i < data.category_list.length; i++) {
        $scope.categories.push({category_name: data.category_list[i].category_name, category_id: data.category_list[i]._id,  selected: false})
      };
    });



    $scope.selectionIDs = [];
    $scope.selectionNames = [];
   
    $scope.$watch('categories|filter:{selected:true}', function(nv) {
      $scope.selectionIDs = nv.map(function(category) {
        return category.category_id;
      });
      $scope.selectionNames = nv.map(function(category) {
        return category.category_name;
      });
    }, true);




    socket.on('update', function(data){
      console.log("SOCKET UPDATE: En ny loppis som heter " + data.realname + " " + data.room + " " + data.catname);
      var alertobj = { name: data.realname, catname: data.catname, msg: 'Well done! You successfully read this important alert message.' };
      $scope.addAlert(data.realname, data.catname);
    });


    $scope.done = function() {

      http.post('addRoom', {realname: $scope.name, start_date: $scope.start, end_date: $scope.end, event_text: $scope.eventtext, category_ids: $scope.selectionIDs}, function(response) {
        for (category in $scope.selectionIDs) {
          socket.emit('update', {room: $scope.selectionIDs[category], message: "nu loppis", catname: $scope.selectionNames[category], realname: $scope.name, start_date: $scope.start, end_date: $scope.end, event_text: $scope.eventtext, category_ids: $scope.selectionIDs});
        }
       

        //töm input-fälten i formuläret
        $scope.name ="";
        $scope.start = "";
        $scope.end = "";
        $scope.eventtext = "";
        $scope.categories.map(function(category) {
          category.selected = false;
        });




        //pusha nya loppisen till befintliga listan
        $scope.rooms.push(response.room);
        var newCat = "";
        for (names in $scope.selectionNames) {
          newCat += $scope.selectionNames[names] + " ";
        }
        $scope.catnames.push(newCat);

        //Försökte fixa fint added-meddelande, kanske fixar sen
        // $scope.added = "success";
        // setTimeout(function() { 
        //   $scope.$evalAsync(function() {
        //     $scope.added="null";
        //   });
        // }, 1500); 



      });
    };

    $scope.redirect = function(room) {
      console.log("hej");
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/security/' + room.name);
    };
  }
]);

chattControllers.controller('roomController', ['$scope', 'HttpService', '$routeParams', 'UserService', 
  function($scope, http, $routeParams, user) {
    $scope.room = $routeParams.room;
    $scope.entries = [];
    $scope.messages = [];
    $scope.posts = [];

    $scope.events = [];

    //hämtar alla posts från post list
    http.get("/security/"+$scope.room, function(data) {
      console.log("Detta är data fr post_list"+ data.post_list);
      $scope.posts = data.post_list;
    });

    http.get("/eventinfo/"+$scope.room, function(eventdata) {
      console.log("Detta är eventdata fr event_info"+ eventdata.event_info);
      $scope.infos = eventdata.event_info;
    });

    http.get("/attendinglist/"+$scope.room, function(attendingdata) {
      console.log("Detta är attendingdata fr attendinglist"+ attendingdata.attending_list);
      $scope.attendings = attendingdata.attending_list;
    });


    var socket = io().connect();
    //socket.emit("join", {name: "hej"});



    
    // $scope.entries = ["always", "leaving", "from", "recieve", "me", "down"];
    //hämtar alla posts från post list
    http.get("/security/"+$scope.room, function(data) {
      console.log("Detta är data fr post_list"+ data.post_list);
      $scope.posts = data.post_list;
      //socket.emit("join", {name:$scope.room, username: user.getName()});
    });

    http.get("/eventinfo/"+$scope.room, function(eventdata) {
      console.log("Detta är eventdata fr event_info"+ eventdata.event_info);
      $scope.infos = eventdata.event_info;
      //socket.emit("join", {name:$scope.room, username: user.getName()});
    });

    http.get("/attendinglist/"+$scope.room, function(attendingdata) {
      console.log("Detta är attendingdata fr attendinglist"+ attendingdata.attending_list);
      $scope.attendings = attendingdata.attending_list;
      //socket.emit("join", {name:$scope.room, username: user.getName()});
    });



    socket.on('update', function (data) {
      $scope.$apply(function(){
        console.log('update socket in roomcontroller');
        console.log(data);
        $scope.messages.push(data.post_list + ": " + data.update);
      });
    });

    socket.on('join', function (data) {
      $scope.$apply(function(){
        console.log("join");
        console.log(data);
        $scope.entries.push(data.username + " joined the channel");
      });
    });

    $scope.redirect = function(room) {
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/security/' + room.name);
    };

    $scope.done = function (data) {
      console.log("Reached done()");
      location.reload(true);
      http.post('addMessage', {event_name:$scope.room, message:$scope.message}, function(posts) {
      });
    };

//http.post('attendingEvent', {event_name:$scope.room, reason:"buy", username:user.getName()}, function(attlist) {
    //när ngn klickat attend event som köpare. skickar post m anvnamn, eventnamn, reason m.m 
    $scope.buy = function() {
      console.log("Reached buy()");
      http.post('attendingEvent', {event_name:$scope.room, reason:"buy"}, function(attlist) {
      //socket.emit("update", {event_name:$scope.room, reason:"buy"});
      });
    };

    //när ngn klickat attend event som säljare. skickar post m anvnamn, eventnamn, reason m.m 
    $scope.sell = function() {
      console.log("Reached sell()");
      http.post('attendingEvent', {event_name:$scope.room, reason:"sell"}, function(attlist) {
      //socket.emit("update", {event_name:$scope.room, reason:"sell"});

      });
    };

//http.post('attendingEvent', {event_name:$scope.room, reason:"buy", username:user.getName()}, function(attlist) {
    //när ngn klickat attend event som köpare. skickar post m anvnamn, eventnamn, reason m.m 
    $scope.buy = function() {
      console.log("Reached buy()");
      http.post('attendingEvent', {event_name:$scope.room, reason:"buy"}, function(attlist) {
      socket.emit("update", {event_name:$scope.room, reason:"buy"});
      });
      location.reload(true);
    };

    //när ngn klickat attend event som säljare. skickar post m anvnamn, eventnamn, reason m.m 
    $scope.sell = function() {
      console.log("Reached sell()");
      http.post('attendingEvent', {event_name:$scope.room, reason:"sell"}, function(attlist) {
      socket.emit("update", {event_name:$scope.room, reason:"sell"});
      });
      location.reload(true);
    };

    //$(messageSendbtn).click(function(){
      //location.reload(true);22
    //});
      //nedan är raden fr originalversion (bortkommenterad pga att user och getname inte används här)
      //socket.emit("update", {room:$scope.room, update:$scope.mess, username:user.getName()});
      //$scope.mess = "";
      //$scope.message = "";

      //response is not defined
      //console.log("Message response getmessages:" + getmessages.message);
      //$scope.message.push(getmessages.message);
    }
]);


chattControllers.controller('aboutController', ['$scope',
  function($scope) {

  }
]);

chattControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService', 'socket',
  function($scope, http, $location, user, socket) {
    $scope.name = "";
    $scope.password= "";

    //console.log(socket.test());
    $scope.done = function() {
      console.log("Reached done()");
      var data = {username: $scope.name , password: $scope.password};
      console.log("tuser: " + data.username);

      http.post('login', data, function(){
        console.log("vi får ut ngt: ");
        $location.path('list');
      });

      http.post('setUser', {realname: $scope.name}, function(response) {
        console.log(response);
        user.setName($scope.name);
        /*Hej Sofie! Detta nedan ska endast göras om man lyckas med att logga in.
        Är det här det ska ligga då? //Ellinor */

        http.post('/joinNotification', {name: $scope.name}, function(data) {
          console.log(data.category_list);
          // var socketInstance = socket.getSocket();
          user.setInterests(data.category_list);
          for (category in data.category_list) {
            console.log("joining category notif room for category: " + data.category_list[category]);
            socket.emit("join", {name: data.category_list[category]});
            // socket.join(data.category_list[category]);
            // socketInstance.emit('join', {name: data.category_list[category]});
          }
          $location.path('list');
        });
      });
      
    };

  }
]);

chattControllers.controller('registerController', ['$scope', 'HttpService', '$location',
  function($scope, http) {
    $scope.email = "";
    $scope.username = "";
    $scope.password = "";
    $scope.categories = [];
    $scope.selectedCategories = [];
    $scope.unvalidClass = {unvalid: false};
    

    $scope.categories = [];
    http.get("/categorylist", function(data) {
      for (var i = 0; i < data.category_list.length; i++) {
        $scope.categories.push({category_name: data.category_list[i].category_name, category_id: data.category_list[i]._id,  selected: false})
      };
      console.log("populating categories in registerController: " + $scope.categories);
    });

    $scope.selectionIDs = [];
    $scope.selectionNames = [];
    $scope.$watch('categories|filter:{selected:true}', function(nv) {
      $scope.selectionIDs = nv.map(function(category) {
        return category.category_id;
      });
      $scope.selectionNames = nv.map(function(category) {
        return category.category_name;
      });
    }, true);

    var newUser = {};
    var interests = [];


    $scope.addUser = function() {
      console.log("Reached addUser()");
      console.log("Och här email:" + $scope.email);

      //spara valda loppiskategorier för att lägga i newUser
      // for(var i = 0; i <$scope.selectedCategories.length; i++){
      //   interests.push($scope.selectedCategories[i].category_name);
      // }

      //skapa ny användare och skicka till db
      newUser = {email: $scope.email, username: $scope.username, password: $scope.password, interested_in: $scope.selectionIDs};
      console.log(newUser);

      http.post('register', newUser, function($location){
        //kommer inte tillbaka hit efter att reg och inlogg är klar?
        console.log("tillagd");
        console.log("Här är svaret:");
        $location.path('/login');
        
      });

      //nollställ form vid sumbit. fungerar ej.
      //$scope.newForm.$setUntouched();
    };
  }

  ]);

chattControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      console.log("location = " + $scope.location);
    };

  }
]);
