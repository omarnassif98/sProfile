function dismissCreateWindow(ev){
    if(ev.target != ev.currentTarget){
        return;
    }
    document.getElementById('overlay').style.display= 'none';
    document.getElementById('create').style.display = 'none';
}

function dismissEditWindow(ev){
    if(ev.target != ev.currentTarget){
        return;
    }
    document.getElementById('overlay').style.display= 'none';
    document.getElementById('edit').style.display = 'none';
}

var quadLock = [false, false, false, false];
var listingData = {};
var files = {};
var gameName = null;
var currentActiveDropdown = null;
var uiConfig = {
  callbacks:{signInSuccessWithAuthResult: function(authResult) {
    console.log(authResult);
    if(authResult.additionalUserInfo.isNewUser == true){
        console.log('New user wtf ' + authResult.user.uid);
        database.ref('game_devs/'+authResult.user.uid).set({"date joined":Date.now()}).then(function(){location.reload(); return false;})
    }else{
        location.reload();
        return false;
    }
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
  firebase.auth().onAuthStateChanged(function(user) {
  //console.log(user);
    if (user) {
        document.getElementById('loginDropdown').style.display = 'none';
        document.getElementById('profileDropdown').style.display = 'block';
        var loginEvent = new Event('authComplete');
        document.dispatchEvent(loginEvent);
        database.ref('game_devs/'+user.uid).get().then(function(snapshot){
        console.log(snapshot);
        if (snapshot.exists()){
        let data = snapshot.val();
        
        for(let key in data.games){
        AddListing(data.games[key].title, data.games[key].desc, data.games[key].ref);
    }  
    

        document.getElementById("placeholder").style.display = 'none';
        document.getElementById('createBtn').disabled = false;
        document.getElementById('createBtn').addEventListener('click', function(){
        overlay.style.display = 'flex';
        document.getElementById('create').style.display = 'block';
        quadLock = [false, false, false, false];
        listingData = {};
        files = {};
        overlay.addEventListener('click', dismissCreateWindow);
        overlay.removeEventListener('click', dismissEditWindow);
        TryReadyCreation();
        })
    }else{
        document.getElementById("placeholder").innerHTML = "You are logged into a player account, make a game developer account";

    }
        }).catch(function(error){
            console.log(error);
        document.getElementById("placeholder").innerHTML = "You are logged into a player account, make a game developer account";
    });
    }
  }
);

function AddListing(gameTitle, desc, ref){
    let listingWrapper = document.getElementById('listingWrapper');
    let listing = document.createElement('div');
    listing.classList.add('listing');
    let title = document.createElement('h3');
    title.innerHTML = gameTitle;
    listing.appendChild(title)
    listing.id = ref;

    listing.addEventListener('click', function(){
        overlay.style.display = 'flex';

        document.getElementById('edit').style.display = 'block';
        document.getElementById('editTitle').placeholder = gameTitle;
        document.getElementById('editDesc').placeholder = desc;
        
        overlay.addEventListener('click', dismissEditWindow);
        overlay.removeEventListener('click', dismissCreateWindow);
        listingData = {};
        files = {};
        gameRef = ref;
    });
    
    listingWrapper.appendChild(listing);
}
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

function AddProfileDropdown(){
    document.getElementById('loginDropdown').style.display = 'none';
    document.getElementById('profileDropdown').style.display = 'block';
    document.getElementById('user').innerHTML = sessionStorage.getItem('userName');   
}


function SetText(input, lockNum){
    var fieldName = (lockNum == 0)?"title":"desc";
    if(input.value.length > 0){
        listingData[fieldName] = input.value;
        quadLock[lockNum] = true;
    }else{
        quadLock[lockNum] = false;
    }
    TryReadyCreation();
}
function FileUpload(input, lockNum){
    var fileName = (lockNum == 2)?"artwork":"game";
    if(input.files.length > 0){
        files[fileName] = input.files[0];
        quadLock[lockNum] = true;
    }else{
        quadLock[lockNum] = false;
    }
    TryReadyCreation();
}

function TryReadyCreation(){
    for(var i = 0; i < 4; i++){
        if(quadLock[i] == false){
            document.getElementById('submitListingsBtn').disabled = true;
            return;
        }
    }
    document.getElementById('submitListingsBtn').disabled = false;
}

function SubmitListingCreation(){
    let newGameRef = database.ref('games').push(listingData).key;
    let storageRef = storage.ref(newGameRef);
    for (let key in files){
        storageRef.child(key).put(files[key]);
    }
    
    database.ref("game_devs/" + firebase.auth().currentUser.uid + "/games/" + newGameRef).set({"title":listingData.title,"ref":newGameRef, "desc": listingData.desc}).then(function(){
            AddListing(listingData.title, listingData.desc, newGameRef);
            document.getElementById('overlay').style.display= 'none';
            document.getElementById('create').style.display = 'none';
        });;
}

function UpdateListing(){
    let storageRef = storage.ref(gameRef);
    for (let key in files){
        storageRef.child(key).put(files[key]);
    }
    database.ref("game_devs/" + firebase.auth().currentUser.uid + "/games/" + gameRef).update(listingData).then(database.ref('games/' + gameRef).update(listingData));

    
    if(listingData.title){
        document.getElementById(gameRef).firstChild.innerHTML = listingData.title;
    }
    
    database.ref('games/' + gameRef).update(listingData).then(function(){
        document.getElementById('overlay').style.display= 'none';
        document.getElementById('edit').style.display = 'none';
    });;

}

function DeleteListing(){
    storage.ref(gameRef).listAll().then((res) => {
        res.items.forEach((item) => {
            item.delete();
        })
    });
    database.ref('games/' + gameRef).remove();
    database.ref("game_devs/" + firebase.auth().currentUser.uid + "/games/" + gameRef).remove().then(function(){
        document.getElementById(gameRef).remove();
        document.getElementById('overlay').style.display= 'none';
        document.getElementById('edit').style.display = 'none';
    });
    }