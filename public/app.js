/* global moment angular firebase */

const config = {
  apiKey: "AIzaSyBNrEN1Fky62nXXXeDYqb9p_c5O6oJkuyY",
  authDomain: "cargoapp-44c45.firebaseapp.com",
  databaseURL: "https://cargoapp-44c45.firebaseio.com",
  storageBucket: "cargoapp-44c45.appspot.com",
  messagingSenderId: "642542294812"
};
firebase.initializeApp(config);
let carDb = null

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
  this.cars = []
  
  const thenSave = fn => (...args) =>{
    fn(...args)
    setTimeout(() => {
      const newVal = strip$Keys({
        cars: this.cars, 
      })
      carDb.set(newVal);
    })
  }

  const d = dateString => moment(dateString).unix()
    
  this.calcPercent = ({odometer}, {next, previous}) => {
    const pcntMileage = next.mileage == null ? 0  : 
                        (odometer - previous.mileage) / (next.mileage - previous.mileage)
    const pcntDate = next.date == null ? 0 :
                        (d(moment()) - d(previous.date)) / (d(next.date) - d(previous.date))
    const pcntLarger = pcntMileage > pcntDate ? pcntMileage : pcntDate
    return Math.round(100 * (pcntLarger > 1 ? 1 : pcntLarger))
  }
  
  this.carCheckingIn = null;
  this.beginCheckIn = (car) => this.carCheckingIn = { newOdometer: car.odometer, car};
  this.finishCheckIn = thenSave(() =>{
     this.carCheckingIn.car.odometer = this.carCheckingIn.newOdometer;
     this.carCheckingIn = null;
  });
  
  this.trackerUpdating = null;
  this.beginTrackerUpdate = (item, car) => {
    this.trackerUpdating = {
      odometer: car.odometer,
      previous: { date: new Date(), mileage: car.odometer },
      next: {},
      item: item,
      car: car,
    }
  }
  this.finishTrackerUpdate = thenSave(() => {
    const tu = this.trackerUpdating;
    tu.car.odometer = tu.odometer;
    tu.item.previous = tu.previous;
    tu.item.next = tu.next
    this.trackerUpdating = null;
  });
  
  this.creatingCar = null
  this.beginCreatingCar = () => this.creatingCar = {}
  this.finishCreatingCar = thenSave(() => {
    this.cars.push({
      name: this.creatingCar.name,
      odometer: this.creatingCar.odometer,
      tracking: []
    })
    this.creatingCar = null;
  })
  
  this.deleteCar = thenSave((car) => {
    if(confirm(`Are you sure? All data on your ${car.name} will be lost`))
      this.cars = this.cars.filter(c => c != car);
  })
  
  this.addingTrackingItem = null
  this.beginAddingTrackingItem = (car) => this.addingTrackingItem = { previous: {mileage: null, date: null}, next: {mileage: null, date: null}, car}
  this.finishAddingTrackingItem = thenSave(() => {
    const {car} = this.addingTrackingItem
    car.tracking || (car.tracking = [])
    car.tracking.push(pick(this.addingTrackingItem, 'name', 'previous', 'next'))
    this.addingTrackingItem = null
  })

  this.isLoginUiLoading = true;
  
  firebase.auth().onAuthStateChanged((user) => {
    $scope.$apply(() => {
      this.isLoggedIn = !!user
      const {uid} = firebase.auth().currentUser;
      carDb =  firebase.database().ref(`users/${uid}/Cars`)
    });
    carDb.on('value', (db) => $scope.$apply(() => {
      this.cars = db.val() && db.val().cars || []
      this.cars.forEach(c => {
        c.tracking || (c.tracking = [])
        c.tracking.forEach(t => {
          t.previous || (t.previous = {});
          t.next || (t.next = {});
        })
      })
    }));
  },(error) => {
    $scope.$apply(() => {
      this.isLoggedIn = false;
      console.error(error);
    })
  });
  
  const uiConfig = {
    callbacks: {
      uiShown: () => this.isLoginUiLoading = false
    },
    credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
    // Query parameter name for mode.
    queryParameterForWidgetMode: 'mode',
    // Query parameter name for sign in success url.
    queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //  dont need these
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      {
        // dont need this, this is for local auth
        // provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // Whether the display name should be displayed in the Sign Up page.
        requireDisplayName: true
      }
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', uiConfig); // The start method will wait until the DOM is loaded.
  
}]);
