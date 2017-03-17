var app = angular.module('plunker', ['google-maps']);

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

  $scope.map = {
    control: {},
    center: {
        latitude: -37.812150,
        longitude: 144.971008
    },
    zoom: 14
  };

  // marker object
  $scope.marker = {
    center: {
        latitude: -37.812150,
        longitude: 144.971008
    }
  }

  // instantiate google map objects for directions
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder();

  // directions object -- with defaults
  $scope.directions = {
    origin: "Collins St, Melbourne, Australia",
    destination: "MCG Melbourne, Australia",
    showList: false
  }

  // get directions using google maps api
  $scope.getDirections = function () {
    var request = {
      origin: $scope.directions.origin,
      destination: $scope.directions.destination,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response, 'direction service success response');
        writeUserData(currentUser.uid, currentUser.displayName, currentUser.email, response.request);
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap($scope.map.control.getGMap());
        directionsDisplay.setPanel(document.getElementById('directionsList'));
        $scope.directions.showList = true;
      } else {
        alert('Google route unsuccesfull!');
      }
    });
  }

});
