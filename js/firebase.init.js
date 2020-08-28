    angular.module('firebaseConfig', ['firebase'])
      .run(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA5paZ77_UctF6nE9HVnX_PcEayIIA4pFY",
    authDomain: "myhalaqah101.firebaseapp.com",
    databaseURL: "https://myhalaqah101.firebaseio.com",
    projectId: "myhalaqah101",
    storageBucket: "myhalaqah101.appspot.com",
    messagingSenderId: "364416293521"
  };
  firebase.initializeApp(config);
      })