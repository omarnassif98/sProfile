var currentCustomizations = {'Eyes':0, 'Nose':0, 'Mouth':0}
document.addEventListener('authComplete', function(){SetupPage()});

async function SetupPage(){
    await GetCurrentProfile();
    SetupCustomization();
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

async function SetupCustomization(){
    let wrapper = document.getElementById('profileCustomizer');
    console.log(wrapper);
    let svg = new DOMParser().parseFromString(await ResourceRequest(window.origin + '/svg/avatar'), 'image/svg+xml').getElementsByTagName('svg')[0];
    console.log(svg);
    for(cat in currentCustomizations){
        let group = svg.getElementById(cat);
        group.children[currentCustomizations[cat]].style.display = 'inline'
    }
    wrapper.appendChild(document.createElement('div').appendChild(svg));
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
    
    group.children[currentCustomizations[category]].style.display = 'none';
    currentCustomizations[category] += dir;
    group.children[currentCustomizations[category]].style.display = 'inline';
}
