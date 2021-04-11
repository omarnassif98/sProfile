window.onload = function(){
    
    database.ref('games').get().then(function(snapshot){
        let games = snapshot.val();
        let listingWrapper = document.getElementById('listingWrapper');
        for (key in games){
            console.log(key);
            storage.ref(key).child('artwork').getDownloadURL().then(function(artworkUrl){
                console.log(artworkUrl);
                storage.ref(key).child('game').getDownloadURL().then(function(gameUrl){
                    console.log(games[key]);
                    let newListing = document.createElement('div');
                    newListing.classList.add('listing');
                    let title = document.createElement('h3');
                    title.innerHTML = games[key].title;
                    let titleWrapper = document.createElement('div');
                    titleWrapper.appendChild(title);
                    
                    let desc = document.createElement('p');
                    desc.innerHTML = games[key].desc;
                    desc.style.float = 'left'
                    
                    let gameImage = document.createElement('img');
                    gameImage.setAttribute('src', artworkUrl);
                    gameImage.style.float = 'right';
                    
                    gameImage.width = 100;
                    gameImage.height = 100;
                    let detailWrapper = document.createElement('div');
                    detailWrapper.appendChild(desc);
                    detailWrapper.appendChild(gameImage);

                    let listingBtn = document.createElement('button');
                    listingBtn.addEventListener('click', function(){
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = (event) => {
                            var blob = xhr.response;
                            var blobUrl = URL.createObjectURL(blob);
                            var link = document.createElement("a"); // Or maybe get it from the current document
                            link.href = blobUrl;
                            link.download = games[key].title + ".exe";
                            link.click();
                            console.log("downloaded");
                            
                        };
                        xhr.open('GET', gameUrl);
                        xhr.send();
                    
                    })
                    listingBtn.innerHTML = 'Download Game'
                    newListing.appendChild(titleWrapper);
                    newListing.appendChild(detailWrapper);
                    newListing.appendChild(listingBtn);
                    listingWrapper.appendChild(newListing);
                })

            })
            

            
        }
        
            
         
    }).then(function(){document.getElementById('placeholder').remove(); console.log('ooha');})   
}