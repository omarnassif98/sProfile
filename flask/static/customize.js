const currentCustomizations = {'Eyes':0, 'Nose':0, 'Mouth':0}
SetupCustomization();
async function SetupCustomization(){
    let wrapper = document.getElementById('controlBackdrop');
    console.log(wrapper);
    let svg = new DOMParser().parseFromString(await ResourceRequest(window.origin + '/svg/avatar'), 'image/svg+xml').getElementsByTagName('svg')[0];
    console.log(svg);
    for(cat in currentCustomizations){
        let group = svg.getElementById(cat);
        group.children[currentCustomizations[cat]].style.display = 'inline'
    }
    wrapper.appendChild(document.createElement('div').appendChild(svg));
}

function ChangeConfig(category, dir){
    let group = document.getElementById(category);
    if (currentCustomizations[category] + dir < 0 || currentCustomizations[category] + dir >= group.childElementCount){
        console.log('out of bounds');
        return;
    }
    
    group.children[currentCustomizations[category]].style.display = 'none';
    currentCustomizations[category] += dir;
    group.children[currentCustomizations[category]].style.display = 'inline';
}