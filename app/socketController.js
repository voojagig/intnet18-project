/* jslint node: true */
"use strict";

var model = require('./model.js');

module.exports = function (socket, io) {

  // user joins room
  socket.on('join', function (req) {
    console.log("socketController.js i socket.on('join'..");
    console.log(req);
    var name = req.name;
    //var user = req.user;
    //var room = model.findRoom(name);
    // room.addUser(user);
    socket.join(name);
    console.log('A user joined ' + name);
    io.to(name).emit('join', req);
    //room.addMessage(req.username + " joined the channel");
  });

  // user gets updated
  socket.on('update', function (req) {
    console.log("socketController.js i socket.on('update'..)");
    console.log(req);
    var roomName = req.room;
    io.to(roomName).emit('update', req, console.log("hello"));
    var room = model.findRoom(roomName);

  });


  // user leaves room
  socket.on('leave', function (req) {
    console.log("socketController.js i socket.on('leave'");
    console.log(req);
    var name = req.name;
    var user = req.user;
    var room = model.findRoom(name);
    // room.removeUser(user);
    console.log('A user left ' + name);
    io.to(name).emit('leave', user);
  });

};
