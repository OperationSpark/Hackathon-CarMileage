/* global moment angular */

const mainModule = angular.module('mainModule', []);


const lpad = (str, padWith, minLength) =>
  str.length >= minLength ? str : lpad(padWith+str, padWith, minLength);
const rand2Hex = () => lpad(Math.floor(Math.random()*256).toString(16), '0', 2);
const randomColor = () => `#${rand2Hex()}${rand2Hex()}${rand2Hex()}`;

mainModule.controller('MainCtrl', [function() {
  this.cars = [
    {
      name: "My Honda",
      odometer: 41900,
      tracking: [
        { name: "Oil Change", color: randomColor(), next: { mileage: 42000, date: '2017-05-01'}, previous: { mileage: 38000, date: '2017-01-01'} },
      ],
    }
  ];


  const d = dateString => moment(dateString).unix()
    
  this.calcPercent = ({odometer}, {next, previous}) => {
    const pcntMileage = next.mileage === null ? 0  : 
                        (odometer - previous.mileage) / (next.mileage - previous.mileage)
    const pcntDate = next.date === null ? 0 :
                        (d(moment()) - d(previous.date)) / (d(next.date) - d(previous.date))
    return 100 * (pcntMileage > pcntDate ? pcntMileage : pcntDate)
  }
  
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
