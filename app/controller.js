/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

//db
var eventdb = require('./dbmodels/eventdb.js');
var categorydb = require('./dbmodels/categorydb.js');
var userdb = require('./dbmodels/userdb.js');
var postdb = require('./dbmodels/postdb.js');
var attndb = require('./dbmodels/attndb.js');


router.get('/login/new', function(req, res) {
  console.log("nu i new login");
  //res.render('newuser');

  //hämtar kategorier för att visa i flervalslista
  categorydb.find({}, 'category_name', function(err, categories) {
    if (err) return handleError(err);
    var categoryList = [];
    for ( var i = 0; i < categories.length; i++) {
      categoryList.push(categories[i]);
    }
    //skicka till /login/new
    res.json({categoryList: categoryList}); 
  });
});

//=====================================
// hantera ny användare
router.post('/register', function(req, res) {
  console.log("/login in controller.js, adding new user ");
  //Create model instance

  userdb.register(new userdb({username: req.body.email, name: req.body.username, interested_in: req.body.interested_in}), req.body.password, function(err, user) {
    if(err){
      console.log(err);
      // !!! SKICKAR EJ VIDARE RÄTT !!!
      //return res.render('/login.html');
    }
    console.log("logga in ny anv ");
    passport.authenticate("local-login")(req, res, function(){
      
      console.log("inloggad!");
      //res.json("message: du är reggadd");
      // !!! SKICKAR EJ VIDARE RÄTT !!!
    });
  });
});

// Logga in
// router.post('/login', function(req, res){
//   console.log("provar loga in här");
//   passport.authenticate("local")(req, res, function(){
//       console.log("inloggad!");
//       // !!! SKICKAR EJ VIDARE RÄTT !!!
//     });
//   console.log("kom ut fint på andraa sidan. ");
// });

// router.post('/login', function(req, res, next){
//   console.log(" framme i login");
//   // passport.authenticate("local", function(req, res){
//   //      console.log("inloggad!");
//   //      // !!! SKICKAR EJ VIDARE RÄTT !!!
//   //    });
//   passport.authenticate("local-login")(req, res, function(){     
     

//       console.log("inloggad!");
//       successRedirect: (res.sendRedirect("/list"));
//       failureRedirect: (res.sendRedirect("/login"));
//       //res.json("message: du är reggadd");
//       // !!! SKICKAR EJ VIDARE RÄTT !!!
//     });



// }
// );

// app.post('/login', passport.authenticate('local', { successRedirect: '/',
//                                                     failureRedirect: '/login' }));

// router.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/list');
//     });
//   })(req, res, next);
// });


router.post('/setUser', function (req, res) {
  res.json({name:"Anon"});
});

router.get('/logout', function(req, res){
  req.logout();
  console.log("you're logged out");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    console.log("DU ÄR TYDLIGEN INLOGGAD");
    //res.redirect("/");
}

//=====

router.post('/checkEmail', function(req, res) {
  console.log("inside httpcheckuser");
  //res.json();
  console.log("req body:" + req.body);
  userdb.find({email: req.body.email}, 'email' , function(err, users){
    if(err) return handleError(err);

    var userNames = [];
    for (var i = 0; i < users.length; i++) {
      userNames.push(users[i]);
    }
    console.log(userNames);

    res.json({userList: userNames});
  });
});

router.get('/roomlist', function (req, res) {
  console.log("router getting /roomlist");
  eventdb.find().populate('category_ids', 'category_name').exec(function (err, events) {
    if (err) return handleError(err);
    var loppisar = [];
    for (var i = 0; i < events.length; i++) {
      loppisar.push(events[i]);
    }
    res.json({room_list:loppisar});


  });
});



//     , function (err, events) {
//     if (err) return handleError(err);
//     var roomNames = [];
//     for (var i = 0; i < events.length; i++) {
//       roomNames.push(events[i]);
//     }
//     res.json({room_list:roomNames});
//   });
// });

router.get('/categorylist', function(req, res) {
  console.log("router getting /catergorylist");
  categorydb.find({}, 'category_name example_goods', function (err, categories) {
    if (err) return handleError(err);
    var categoryNames = [];
    for (var i = 0; i < categories.length; i++) {
      categoryNames.push(categories[i]);
    }
    res.json({category_list: categoryNames});
  });
});



router.post('/joinNotification', function(req, res) {
  //denna funktion kan nog läggas ihop med inloggningfunktionen sen
  console.log("router getting /joinNotification");

  userdb.find({email: req.body.name}, 'interested_in' , function(err, categories){
    if(err) return handleError(err);
    console.log("UTDRAG FROM USERDB");
    console.log(categories);
    if(categories.length > 0) {
      categories = categories[0].interested_in;
    }
    

    console.log("FÖRSÖKER PLOCKA UT UTDRAG.interested_in");
    console.log(categories);
    res.json({category_list: categories});
  });

});

router.get('/security/:room', function (req, res) {
  console.log("router getting /security/:room och post_list !!!");
  //hämtar alla posts i postsdb som gjorts i ett visst loppisrum
  var room = req.params.room;
  console.log("detta är rummet:" + room);
  
  postdb.find({ 'event_name': room}, 'event_name message username timestamp', function (err, posts) {

    if (err) return handleError(err);
    var postMessages = [];
    console.log(posts);
    for (var i = 0; i < posts.length; i++) {
      console.log(posts[i].message);
      postMessages.push(posts[i]);
    }
    res.json({post_list: postMessages});
  });
});

  //hämtar info om loppiseventet du är inne på

router.get('/eventinfo/:room', function (req, res) {
  console.log("router getting /eventinfo/:room och event_info !!!");
  var room = req.params.room;
  console.log("detta är eventet:" + room);
  
  eventdb.find({ 'name': room}, 'name start_date end_date u_id event_text category_ids', function (err, infos) {
    
    if (err) return handleError(err);
    var eventInfo = [];
    console.log(infos);
    for (var i = 0; i < infos.length; i++) {
      console.log(infos[i].message);
      eventInfo.push(infos[i]);
    }
    res.json({event_info: eventInfo});
  });
});

router.get('/attendinglist/:room', function (req, res) {
  console.log("router getting /attendinglist/:room och attending_list !!!");
  var room = req.params.room;
  console.log("detta är Loppisen för Attendinglist:" + room);
  
  attndb.find({ 'event': room}, 'event attendreason', function (err, attendings) {
    if (err) return handleError(err);
    var attendingList = [];
    console.log(attendings);
    for (var i = 0; i < attendings.length; i++) {
      console.log(attendings[i].message);
      attendingList.push(attendings[i]);
    }
    res.json({attending_list: attendingList});
  });
});

//hämtar info om loppisevent när du är inne på ett visst "loppisrum"
router.get('/roomlist/:room', function (req, res) {
  console.log("/roomlist/:room router getting eventlist from eventsdb");
  var room = req.params.room;
  console.log("detta är rummet:" + room);

});

  //var messages = model.findRoom(req.params.room).messages;
  //res.json({list: messages});
//};



router.post('/addRoom', function (req, res) {
  console.log("/addRoom in controller.js, adding loppis " + req.body.realname);
  console.log("the categories ids to ad: " + req.body.category_ids);
  //Create model instance

  eventdb.create({ name: req.body.realname, start_date: req.body.start_date, end_date: req.body.end_date, event_text: req.body.event_text, u_id: 32, category_ids: req.body.category_ids}, function (err, newEvent) {
  if (err) return handleError(err);
    console.log("Below was added to eventdb:");
    console.log(newEvent)
    res.json({room:newEvent});
  });

});

router.post('/addMessage', function (req, res) {
  console.log("/addMessage in controller.js, adding a message " + req.body.message);
  //Create model instance
  postdb.create({event_name: req.body.event_name, message: req.body.message}, function (err, newMessage) {
  if (err) return handleError(err);
    res.json({room:newMessage});
  });
});

router.post('/attendingEvent', function (req, res) {
  console.log("/attendingevent in controller.js, adding a attendee");
  attndb.create({event: req.body.event_name, attendreason: req.body.reason}, function (err, newAttendee) {
  if (err) return handleError(err);
    res.json({room:newAttendee});
  });
});


module.exports = router;