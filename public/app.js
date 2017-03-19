/* global moment angular firebase */

const carDb = firebase.database().ref('Cars/')
const mainModule = angular.module('mainModule', []);

const lpad = (str, padWith, minLength) =>
  str.length >= minLength ? str : lpad(padWith+str, padWith, minLength);
const rand2Hex = () => lpad(Math.floor(Math.random()*256).toString(16), '0', 2);
const randomColor = () => `#${rand2Hex()}${rand2Hex()}${rand2Hex()}`;
const pick = (obj, ...props) => props.reduce((o, p) => Object.assign(o, {[p]: obj[p]}), {});

const isObject = (obj) => obj && ( typeof obj === 'object')
const strip$Keys = (obj) => {
  if(!isObject(obj))
		return obj
  if(Array.isArray(obj))
		return obj.map(strip$Keys)
	return Object.keys(obj)
		.filter(p => p[0] != '$')
		.map(p => [p,  strip$Keys(obj[p])])
		.reduce((o, [p, val]) => Object.assign(o, {[p]: val}), {})
}

mainModule.controller('MainCtrl', ['$scope', '$document', function($scope, $document) {
  
  // Sample Data, true data loaded from firebasej
  // this.cars = [
  //   {
  //     name: "My Honda",
  //     odometer: 41650,
  //     tracking: [
  //       { name: "Oil Change", color: randomColor(), next: { mileage: 42000, date: '2017-05-01'}, previous: { mileage: 38000, date: '2017-01-01'} },
  //       { name: "Tire Rotation", color: randomColor(), next: { mileage: 62000, date: '2018-01-10'}, previous: { mileage: 40000, date: '2017-03-01'} },
  //     ],
  //   },
  // ];
  const thenSave = fn => (...args) =>{
    fn(...args)
    setTimeout(() => {
      carDb.set(strip$Keys({
        cars: this.cars, 
      }));
    })
  }

  const d = dateString => moment(dateString).unix()
    
  this.calcPercent = ({odometer}, {next, previous}) => {
    const pcntMileage = next.mileage == null ? 0  : 
                        (odometer - previous.mileage) / (next.mileage - previous.mileage)
    const pcntDate = next.date == null ? 0 :
                        (d(moment()) - d(previous.date)) / (d(next.date) - d(previous.date))
    return Math.floor(100 * (pcntMileage > pcntDate ? pcntMileage : pcntDate))
  }
  
  this.carCheckingIn = null;
  this.beginCheckIn = (car) => this.carCheckingIn = { newOdometer: car.odometer + 100, car};
  this.finishCheckIn = thenSave(() =>{
     this.carCheckingIn.car.odometer = this.carCheckingIn.newOdometer;
     this.carCheckingIn = null;
  });
  
  this.trackerUpdating = null;
  this.beginTrackerUpdate = (item, car) => {
    const d = dateString => moment(dateString);
    
    const today = moment().format('MM/DD/YY');
    this.trackerUpdating = {
      currentOdemeter: car.odometer,
      operationDay: today,
      milesLifespan: item.next.mileage ? item.next.mileage - item.previous.mileage : 0,
      daysLifespan: item.next.date ? d(item.next.date).diff(d(item.previous.date), 'days') : '',
      item: item,
      car: car,
    }
  }
  this.finishTrackerUpdate = thenSave(() => {
    let tu = this.trackerUpdating;
    tu.car.odometer = tu.currentOdemeter;
    tu.item.previous.mileage = tu.currentOdemeter;
    tu.item.next.mileage = tu.currentOdemeter + tu.milesLifespan;
    tu.item.previous.date = moment(tu.operationDay, 'MM/DD/YY')
    this.trackerUpdating = null;
  });
  
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

  this.creatingCar = null
  this.beginCreatingCar = () => this.creatingCar = {}
  this.finishCreatingCar = thenSave(() => {
    this.cars.push({
      name: this.creatingCar.name,
      odometer: this.creatingCar.odometer,
      tracking: []
    })
  })
  
  this.addingTrackingItem = null
  this.beginAddingTrackingItem = (car) => this.addingTrackingItem = { previous: {}, next: {}, car}
  this.finishAddingTrackingItem = thenSave(() => {
    const {car} = this.addingTrackingItem
    car.tracking || (car.tracking = [])
    car.tracking.push(pick(this.addingTrackingItem, 'name', 'previous', 'next'))
    this.addingTrackingItem = null
  })

  // Check If User Is Signed In
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      currentUser = user;
      $scope.isLoggedIn = true;
    } else {
      currentUser = null;
      $scope.isLoggedIn = false;
    }
  }, function(error) {
    console.log(error);
  });
  
  carDb.on('value', (db) => $scope.$apply(() => {
    this.cars = db.val() && db.val().cars || []
  }));


}]);