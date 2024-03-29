var currentActiveDropdown = null;
var uiConfig = {
  callbacks:{signInSuccessWithAuthResult: function(authResult) {
    console.log(authResult);
    if(authResult.additionalUserInfo.isNewUser == true){
      console.log('New user wtf ' + authResult.user.uid);
      database.ref('users/'+authResult.user.uid).set({"date joined":Date.now()}).then(function(){ return false;})
  }else{
      location.reload();
      return false;
  }
    return false;
  }
},
    signInOptions: [
      {
          provider:firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName:false
      }
    ],
    signInFlow: 'popup',
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: function() {
      window.location.assign('<your-privacy-policy-url>');
    }
  };
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
document.addEventListener('click', function(event){
  let clickObj = event.target;
  while(clickObj.parentElement){
    if (clickObj.className == "navbar"){
      console.log(clickObj);
      return;
    }
    clickObj = clickObj.parentElement;
  }
  ClearDropdown();
});

firebase.auth().onAuthStateChanged(function(user) {
  console.log(user);
    if (user) {
      database.ref('users/'+user.uid).get().then(function(snapshot){
        console.log(snapshot.val()['date joined']);
        if(snapshot.val().username){
            sessionStorage.setItem('userName', snapshot.val().username);
            var loginEvent = new Event('authComplete');
            document.dispatchEvent(loginEvent);
            database.ref('reverseLookup/'+sessionStorage.getItem('userName')+'/publicProfile').get().then(function(privacy){
            console.log(privacy.val());
            console.log(typeof(privacy.val()));
            let textVal = privacy.val() ? 'TRUE' : 'FALSE';
            sessionStorage.setItem('privacy', textVal);
            AddProfileDropdown();
            });
        }else{
          document.getElementById('loginWindow').style.display =  'block';
          document.getElementById('firebaseui-auth-container').style.display = 'none';
          document.getElementById('profileSetup').style.display = 'block';
        }
      }).catch(function(error){
        console.log(error);
        AddProfileDropdown(false);
        document.dispatchEvent(new Event('improperAuth'));
    });
    }
  }
);
function RevealDropdown(dropdown){
  console.log(dropdown);
    if(currentActiveDropdown){
        currentActiveDropdown.style.display = 'none';
    }
    currentActiveDropdown = dropdown.getElementsByClassName('dropdownContent')[0];
    currentActiveDropdown.style.display = 'block';
}

function ClearDropdown(){
  if(currentActiveDropdown){
    currentActiveDropdown.style.display = 'none';
  }
  currentActiveDropdown = null;
}

function Logout(){
  firebase.auth().signOut().then(location.reload());
}

function AddProfileDropdown(player = true){
    document.getElementById('loginDropdown').style.display = 'none';
    document.getElementById('profileDropdown').style.display = 'block';
    if(player == true){
      document.getElementById('user').innerHTML = sessionStorage.getItem('userName');
      document.getElementById('privacy').innerHTML = 'Public: ' + sessionStorage.getItem('privacy');
    }else{
      document.getElementById('user').style.display = 'none';
      document.getElementById('privacy').style.display = 'none';
    }
}

function UpdateInputProperty(element){
  console.log(element.value);
  let accompanyingButton = document.getElementById('b_' + element.name);
  accompanyingButton.disabled = (element.value.length == 0);
}

function SubmitProfile(buttonTag){
    console.log(document.getElementById(buttonTag));
    let user = document.getElementById(buttonTag.split('_')[1]).value;
    console.log('WHAT THE FUCK ' + user);
    database.ref('reverseLookup/'+user).set({"uid":firebase.auth().currentUser.uid, "publicProfile":true, "email":firebase.auth().currentUser.email}).then(
    database.ref('users/'+ firebase.auth().currentUser.uid).set({username:document.getElementById(buttonTag.split('_')[1]).value}).then(function(){
      document.getElementById(buttonTag).parentElement.style.display = 'none'
      sessionStorage.setItem('userName', document.getElementById(buttonTag.split('_')[1]).value);
      sessionStorage.setItem('privacy', 'TRUE');
      var loginEvent = new Event('authComplete');
      document.dispatchEvent(loginEvent);
      AddProfileDropdown()
    }));
}

function UpdatePrivacy(element){
  console.log(element);
  console.log(element.innerHTML);
  switch (element.innerHTML.split(' ')[1]) {
    case 'TRUE':
      database.ref('reverseLookup/'+sessionStorage.getItem('userName') + '/publicProfile').set(false);
      element.innerHTML = 'Public: FALSE';
      break;
    case 'FALSE':
      database.ref('reverseLookup/'+sessionStorage.getItem('userName') + '/publicProfile').set(true);
      element.innerHTML = 'Public: TRUE';
      break;
  }
}