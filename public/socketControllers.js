/* jslint node: true */
"use strict";

var socket = io().connect();




exports.join = function (name) {
  socket.emit("join", {name: name});
};

exports.update = function (name, message) {
  socket.emit("update", {room: name, message: message});
};

exports.test = function() {
  console.log("testing out socketControllers.js");
}