navigator.geolocation.getCurrentPosition(

    function (position) {
        
        //Find Latitude & Longitude
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        //Make coords array
        const coords = [latitude, longitude]

        //Set map view near your coords
        var map = L.map('map').setView(coords, 13);

        //Generate Map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //Set maker at your coords
        L.marker(coords).addTo(map)
            .bindPopup('Your Current Location')
            .openPopup();

        //Display google maps link in console
        console.log("https://www.google.com/maps/@"+latitude+","+longitude+",15z");

        //Make marker onclick
        map.on('click', function(mapEvent) {
            
            //Get coords and make lat and lng constants
            const lat= mapEvent.latlng.lat
            const lng= mapEvent.latlng.lng

            //Make marker at coords where user clicked
            L.marker([lat, lng]).addTo(map)
                    .bindPopup(L.popup({
                        maxWidth:250,
                        minWidth:100,
                        autoClose:false,
                        closeOnClick:false,
                        className:'running-popup',
                    }))
                    .setPopupContent('workout')
                    .openPopup();

        })
        

    },
    function () {

        alert("Could not get position.");

    }

);

