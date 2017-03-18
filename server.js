var express = require('express');
var path = require('path');
var app = express();

// initialize firebase
// var firebase = require('firebase');
// var config = {
//   apiKey: "AIzaSyBoUPlAe5Jbz_lc20sluF8IW8GQyvj2vjM",
//   authDomain: "project--3096610514914531623.firebaseapp.com",
//   databaseURL: "https://project--3096610514914531623.firebaseio.com",
//   storageBucket: "project--3096610514914531623.appspot.com",
//   messagingSenderId: "640777191644"
// };
// var firebaseApp = firebase.initializeApp(config);
// var db = firebaseApp.database();

// console.log(firebase.app().name);  // "[DEFAULT]"


// console.log(firebaseApp);
// Define the port to run on
app.set('port', process.env.PORT);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
