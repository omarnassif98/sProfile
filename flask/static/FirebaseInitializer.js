if (!firebase.apps.length){
  console.log('INITIALIZED');
  let firebaseConfig = {
    apiKey: "AIzaSyCvBSSphzkWA6GFOxg8YeDfcUHONENMG-M",
    authDomain: "sprofile-8854f.firebaseapp.com",
    databaseURL: "https://sprofile-8854f-default-rtdb.firebaseio.com",
    projectId: "sprofile-8854f",
    storageBucket: "sprofile-8854f.appspot.com",
    messagingSenderId: "394930463524",
    appId: "1:394930463524:web:2d2f9c8ae027d3882109b1"
};
  firebase.initializeApp(firebaseConfig);
}
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
var database = firebase.database();