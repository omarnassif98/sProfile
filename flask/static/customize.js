var currentCustomizations = {'Eyes':0, 'Nose':0, 'Mouth':0}
var baseCustomizations = {...currentCustomizations};
document.addEventListener('authComplete', function(){SetupPage()});
document.addEventListener('improperAuth', function(){document.getElementById('placeholderText').innerHTML = 'You are logged into a developer account. Please Log into a Player account'})
async function SetupPage(){
    document.getElementById('placeholderText').innerHTML = 'Loading... Give it a second';
    await GetCurrentProfile();
    await SetupCustomization();
    document.getElementById('placeholderWrapper').style.display = 'none';
    document.getElementById('customizationWrapper').style.display = 'block';
    console.log('profile shows');
    for(cat in currentCustomizations){
        ChangeConfig(cat, currentCustomizations[cat]);
    }
}
function GetCurrentProfile(){
    return new Promise((resolve) =>{
    if(firebase.auth().currentUser != null){
        database.ref('users/'+firebase.auth().currentUser.uid + '/profileData').get().then(function(snapshot){
            if(snapshot.exists()){
                currentCustomizations = {...snapshot.val()};
                baseCustomizations = {...currentCustomizations};
                resolve();
            }else{
                console.log('it dont exist yo');
                database.ref('users/'+ firebase.auth().currentUser.uid + '/profileData').set(currentCustomizations).then(function(){
                    resolve();
                })
            }
          })
    }
    });
}

function UpdateProfile(){
    database.ref('users/'+ firebase.auth().currentUser.uid + '/profileData').set(currentCustomizations).then(function(){
        baseCustomizations = {...currentCustomizations};
        document.getElementById('saveButton').disabled = true;
    });
}

async function SetupCustomization(){
    let svg = new DOMParser().parseFromString(await ResourceRequest(window.origin + '/svg/avatar'), 'image/svg+xml').getElementsByTagName('svg')[0];
    return new Promise((resolve) => {
    let wrapper = document.getElementById('profileCustomizer');
    console.log(wrapper);
    console.log(svg);
    for(cat in currentCustomizations){
        let group = svg.getElementById(cat);
        group.children[currentCustomizations[cat]].style.display = 'inline'
    }
    console.log('appending');
    wrapper.appendChild(document.createElement('div').appendChild(svg));
    resolve();
});
}

function ChangeConfig(category, num){
    console.log([category, num]);
    if(!(category in currentCustomizations)){
        return;
    }
    let group = document.getElementById(category);
    group.children[currentCustomizations[category]].style.display = 'none';
    currentCustomizations[category] = num;
    group.children[currentCustomizations[category]].style.display = 'inline';
}

function ShiftConfig(category, dir){
    let group = document.getElementById(category);
    if (currentCustomizations[category] + dir < 0 || currentCustomizations[category] + dir >= group.childElementCount){
        console.log('out of bounds');
        return;
    }
    
    console.log("AYYO WHAT THE FUCK");
    group.children[currentCustomizations[category]].style.display = 'none';
    currentCustomizations[category] += dir;
    group.children[currentCustomizations[category]].style.display = 'inline';
    document.getElementById('saveButton').disabled = (JSON.stringify(baseCustomizations) === JSON.stringify(currentCustomizations))
}
