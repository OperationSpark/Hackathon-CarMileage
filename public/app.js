var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, $document) {
  var currentUser;
  //functions to write user data
  function writeUserData(userId, name, email, directionRequest) {
    console.log('Writing Data To Firebase')
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      directionRequest: directionRequest
    });
  }

  // Check If User Is Signed In
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user, 'user is signed in');
      currentUser = user;
      $scope.isLoggedIn = true;
    } else {
      console.log('user is signed out');
      currentUser = null;
      $scope.isLoggedIn = false;
    }
  }, function(error) {
    console.log(error);
  });

});
