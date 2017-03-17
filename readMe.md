Angular Firebase Google Maps Starter Kit
===

##Wrapper

Given that the data is private, we need to create a firebase account manipulate data with firebase. Follow the instructions in creating a firebase project to hook up the app and update the index.html config:

## Create A Firebase Account
1. Go to https://firebase.google.com/
2. Get Started For Free (Log In)
3. Create New Project
4. Name Your project and click Create Project
5. Click Add Firebase to your web App and save that code, you will use this in the next section!
6. Click authentication in the sidebar then set up sign-in method
7. Enable google by clinking on it, turning the slider to right, then click save. Your google Auth will now work.

Side Note:
The app comes with twitter, facebook, and github ready to use, however, if you want them to work you need to enable them on firebase and follow the directions on configuring them through the firebase UI. You can configure these at a later time or simply remove them from the code in your index.html.

## Start Developing

1. Fork this repo on GitHub
2. From your forked GitHub repo, using the SSH clone url option, clone into a new workspace on Cloud9 (c9.io).
3. Once in your workspace, from the root directory, run the command:

        npm install


5. Open the index.html and replace the config with the code you saved earlier when creating your firebase project:

    ````javascript
    // Initialize Firebase
    var config = {
      apiKey: "your_ey",
      authDomain: "your_domain",
      databaseURL: "your_dburl",
      storageBucket: "your storage bucket",
      messagingSenderId: "your messaging id"
    };
    var app = firebase.initializeApp(config);
    ````


5. Next, cd into the root directory, and run the command:

        npm start

## Endpoints

Open app.js for an example of how to post map data:

  ````javascript
  //functions to write user data
  function writeUserData(userId, name, email, directionRequest) {
    console.log('Writing Data To Firebase')
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      directionRequest: directionRequest
    });
  }
  ````

## Resources

Installation & Setup in JavaScript
https://firebase.google.com/docs/database/web/start

auth
https://firebase.google.com/docs/auth/

read-and-write
https://firebase.google.com/docs/database/web/read-and-write

firebaseUI-web API https://github.com/firebase/FirebaseUI-Web

firebase API
https://www.npmjs.com/package/firebase

firebase Web docs
https://firebase.google.com/docs/web/setup
