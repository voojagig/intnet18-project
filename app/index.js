var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var expressSession = require('express-session');
var sharedsession = require('express-socket.io-session');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var model = require('./model.js');


var port = 8080;

var app = express();
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var session = expressSession({
    secret: "MoveFromHereOrTheSecretWillBeOnGit",
    resave: true,
    saveUninitialized: true,
  });
app.use(session);

//set up database connection with mongodb
mongoose.connect('mongodb://localhost/fleamarket');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connection with database established");
});


//setup databases
  var postdb = require("./dbmodels/postdb.js");
  var attndb = require("./dbmodels/attndb.js");
  var categorydb = require("./dbmodels/categorydb.js");
  var userdb = require('./dbmodels/userdb.js');
  var eventdb = require("./dbmodels/eventdb.js");

//====================================================

// empty dbs
  postdb.remove({}, function(err) { 
        console.log('collection postdb removed') 
  });
  attndb.remove({}, function(err) { 
        console.log('collection attendingdb removed') 
  });
  categorydb.remove({}, function(err) { 
        console.log('collection categorydb removed') 
  });
  userdb.remove({}, function(err) { 
        console.log('collection userdb removed') 
  });
  eventdb.remove({}, function(err) { 
        console.log('collection eventsdb removed') 
  });

//====================================================

//setup PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(userdb.authenticate()));
passport.serializeUser(userdb.serializeUser());
passport.deserializeUser(userdb.deserializeUser());

//====================================================

var httpServer = http.Server(app);
var io = require('socket.io').listen(httpServer);
io.use(sharedsession(session));

var router = require('./controller.js');
app.use('/API', router);

var socketController = require('./socketController.js');
io.on('connection', function (socket) {
  socketController(socket, io);
});


//====================================================
//repopulate dbs with test cases
//postdb lägger till testcase
  postdb.create({ message: "detta är en postdb message string i loppis Höganäs", username: "Höganäs-Elin", u_id: 88, event_name: "Höganäs"}, function (err, newMessage) {
    if (err) return handleError(err);
  });
  postdb.create({ message: "detta är en postdb message string i loppis Åstorp", username: "Åstorp-Ellinor", u_id: 88, event_name: "Åstorp"}, function (err, newMessage) {
    if (err) return handleError(err);
      //created
  });

  //attend db lägga till tester
  attndb.create({ attendreason: "Köpa (Höganäs)", event: "Höganäs"}, function (err, newMessage) {
    if (err) return handleError(err);
    });
  attndb.create({ attendreason: "Sälja (Åstorp)", event: "Åstorp"}, function (err, newMessage) {
    if (err) return handleError(err);
    });
  attndb.create({ attendreason: "Sälja (Höganäs)", event: "Höganäs"}, function (err, newMessage) {
    if (err) return handleError(err);
    });

  //then re-populate
  categorydb.create({ category_name: "Möbler", example_goods: ["Byråer", "Sängar", "Hyllor", "Bord", "Stolar", "Skåp"]}, function (err, newEvent) {
    if (err) return handleError(err);
      //created
    });
  categorydb.create({ category_name: "Kläder", example_goods: ["Kjolar", "Klänningar", "Skor", "Byxor", "Jackor"]}, function (err, newEvent) {
    if (err) return handleError(err);
      //created
    });
  categorydb.create({ category_name: "Prylar", example_goods: ["Porslinsfigurer", "Lampskärmar", "Krukor", "Dukar", "Ljusstakar"]}, function (err, newEvent) {
    if (err) return handleError(err);
      //created
    });

  // repopulate event
  eventdb.create({ name: "Höganäs", start_date: "2018-04-01T14:42:11.048Z", end_date: "2018-04-02T14:42:11.048Z", event_text: "Mest krukor och lergods", u_id: "1", category_name: "Prylar"}, function (err, newEvent) {
    if (err) return handleError(err);
    //använder addroom för att det ska funka att lägga in posts på förinlagda loppisar
    console.log('event Höganäs created') 
    //created
  });


httpServer.listen(port, function () {
  console.log("server listening on port", port);
});