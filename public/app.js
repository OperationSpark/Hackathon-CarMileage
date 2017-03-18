var app = angular.module('plunker', []);

const lpad = (str, padWith, minLength) =>
  str.length >= minLength ? str : lpad(padWith+str, padWith, minLength);
const rand2Hex = () => lpad(Math.floor(Math.random()*256).toString(16), '0', 2);
this.randomColor = () => `#${rand2Hex()}${rand2Hex()}${rand2Hex()}`;
    

app.controller('MainCtrl', [function() {
  this.cars = [
    {
      name: "My Honda",
      odometer: 10000,
      tracking: [
        { name: "Oil Change", percent: 60, color: randomColor() },
        { name: "Tire Rotation", percent: 32, color: randomColor() },
        { name: "Tire Change", percent: 75, color: randomColor() },
        { name: "Windshield Fluid", percent: 7, color: randomColor() },
      ],
    }
  ];
  
  // var currentUser;
  //functions to write user data
  // function writeUserData(userId, name, email, directionRequest) {
  //   console.log('Writing Data To Firebase')
  //   firebase.database().ref('users/' + userId).set({
  //     username: name,
  //     email: email,
  //     directionRequest: directionRequest
  //   });
  // }

  // // Check If User Is Signed In
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     console.log(user, 'user is signed in');
  //     currentUser = user;
  //     $scope.isLoggedIn = true;
  //   } else {
  //     console.log('user is signed out');
  //     currentUser = null;
  //     $scope.isLoggedIn = false;
  //   }
  // }, function(error) {
  //   console.log(error);
  // });

}]);
