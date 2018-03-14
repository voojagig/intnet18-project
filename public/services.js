(function() {

  angular.module('chat')
  .factory('UserService', function($http) {

    var username = "";
    var interestlist = [];

    // function getUsername() {
    //   $http.get('/API/getUsername').success(function(response) {
    //     username = response.username;
    //   });
    // }
    //
    // getUsername();

    return {
      // getUsername: getUsername,

      getName: function() {
        return username;
      },

      setName: function(name) {
        username = name;
      },

      setInterests: function(interests) {
        interestlist = interests;
      },

      getInterests: function() {
        return interestlist;
      },


      clearData: function() {
        var username = "";
        var interestlist = [];
      }

    };
  })

.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },

      //   removeAllListeners: function (eventName, callback) {
      //     socket.removeAllListeners(eventName, function() {
      //         var args = arguments;
      //         $rootScope.$apply(function () {
      //           callback.apply(socket, args);
      //         });
      //     }); 
      // },

      init: function() {
            socket.removeAllListeners();
      }

    }
  })

  // .factory('SocketService', function($http) {
    //var socket = io().connect();


    // return {
      // on: socket.on('update', function(data) {
      //   return "yes";
      // }),
      // listen: function() {
      //   return socket.on('update', function() {
      //     console.log("updated socket");
      //   })
      // },
      // getSocket: function() {
      //   return socket;
      // }

      // update(socket, req) {
      //   socket.on('update', function() {
      //     console.log("socket updated in service.js");
      //     socket.emit("update", {room: socket_name, message: message});
      //     return "sucsess"
      //   });
      // }

      // test: function(){
      //  return "test";
      // },

      // join: function(socket_name) {
      //   console.log("trying to join socket name " + socket_name);
      //   socket.emit("join", {name: socket_name});
      // },

      // update: function(socket_name, message) {
      //   socket.emit("update", {room: socket_name, message: message});

      // }
    // };

  // })


  .factory('HttpService', function($http) {
    
    return {
      post: function(path, data, callback){
        $http.post('/API/' + path, data, {withCredentials: true}).success(callback);
      },
      get: function(path, callback){
        $http.get('/API/' + path).success(callback);
      }
    };

  });

})();
