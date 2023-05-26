'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent;

let workouts = [];

/////Classes/////
class Workout {

    date = new Date();
    id =(Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {

        this.coords = coords; // lat & lng
        this.distance = distance; //in km
        this.duration = duration; // in mins

    }

}

//Child class of Workout class
class Running extends Workout {

    type = "Running";

    constructor(coords, distance, duration, cadence) {

        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this.setDescription();

    }

    calcPace() {

        this.pace = this.duration / this.distance;
        return this.pace;

    }

    setDescription() {

        this.description = `${this.type} on ${this.date.toDateString()}`;

    }
}

//Child class of Workout class
class Cycling extends Workout {

    type = "Cycling";

    constructor(coords, distance, duration, elevationGain) {

        super(coords, distance, duration);
        this.elevation = elevationGain;
        this.calcSpeed();
        this.setDescription();

    }

    calcSpeed() {

        this.speed = (this.duration / 60) / this.distance;
        return this.speed;

    }

    setDescription() {

        this.description = `${this.type} on ${this.date.toDateString()}`;

    }

}

navigator.geolocation.getCurrentPosition(

    function (position) {
        
        //Find Latitude & Longitude
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        //Make coords array
        const coords = [latitude, longitude]

        //Set map view near your coords
        map = L.map('map').setView(coords, 13);

        //Generate Map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //Local Data const
        const data = JSON.parse(localStorage.getItem("workout"));

        //Check if there is any data stored
        if (data) {

            workouts = data;

        }

        //Render locally stored workouts
        let html;

        for (let workout of workouts) {

            let lat = workout.coords[0];
            let lng = workout.coords[1];

            //Changes html
            if (type === 'running') {

                //Renders workout in sidebar
                html = `<li class="workout workout--running" data-id=${workout.id}>
                            <h2 class="workout__title">${workout.description}</h2>
                            <div class="workout__details">
                                <span class="workout__icon">🏃‍♂️</span>
                                <span class="workout__value">${workout.distance}</span>
                                <span class="workout__unit">km</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">⏱</span>
                                <span class="workout__value">${workout.duration}</span>
                                <span class="workout__unit">min</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">⚡️</span>
                                <span class="workout__value">${workout.pace}</span>
                                <span class="workout__unit">min/km</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">🦶🏼</span>
                                <span class="workout__value">${workout.cadence}</span>
                                <span class="workout__unit">spm</span>
                            </div>
                        </li>`

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

            } else if (type === 'cycling') {

                //Renders workout in sidebar
                html =  `<li class="workout workout--cycling" data-id=${workout.id}>
                            <h2 class="workout__title">${workout.description}</h2>
                            <div class="workout__details">
                                <span class="workout__icon">🚴‍♀️</span>
                                <span class="workout__value">${workout.distance}</span>
                                <span class="workout__unit">km</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">⏱</span>
                                <span class="workout__value">${workout.duration}</span>
                                <span class="workout__unit">min</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">⚡️</span>
                                <span class="workout__value">${workout.speed}</span>
                                <span class="workout__unit">km/h</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">⛰</span>
                                <span class="workout__value">${workout.elevation}</span>
                                <span class="workout__unit">m</span>
                            </div>
                        </li>`

                //Make marker at coords where user clicked
                L.marker([lat, lng]).addTo(map)
                .bindPopup(L.popup({
                    maxWidth:250,
                    minWidth:100,
                    autoClose:false,
                    closeOnClick:false,
                    className:'cycling-popup',
                }))
                .setPopupContent('workout')
                .openPopup();

            }

            //Displays new workout after to from
            form.insertAdjacentHTML("afterend", html);



        }


        //Set maker at your coords
        L.marker(coords).addTo(map)
            .bindPopup('Your Current Location')
            .openPopup();

        //Display google maps link in console
        console.log("https://www.google.com/maps/@"+latitude+","+longitude+",15z");

        //Make marker onclick
        map.on('click', function(mapE) {
            
            //Make mapEvent = mapE
            mapEvent=mapE;

            //Display Marker Editor
            form.classList.remove('hidden');
            inputDistance.focus();

        })
        

    },
    function () {

        alert("Could not get position.");

    }

);


//form event listener to check if submitted/completed
form.addEventListener('submit', function(e){
    e.preventDefault()

    //Get data from from
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);

    //Get coords and make lat and lng constants
    const lat= mapEvent.latlng.lat
    const lng= mapEvent.latlng.lng
    
    let workout;
    let html;

    //If workout is Running create running object
    if (type == 'running') {
        //create cadence const
        const cadence = Number(inputCadence.value);

        

        workout= new Running([lat,lng], distance, duration, cadence);

    }
    //If workout is Cycling create running object
    if (type == 'cycling') {
        //create elevation const
        const elevation = +inputElevation.value;



        workout= new Cycling([lat,lng], distance, duration, elevation);

    }

    //Adds workout to workouts array
    workouts.push(workout);

    //Saves workout locally
    localStorage.setItem("workouts", JSON.stringify(workouts));

    //Changes html
    if (type === 'running') {

        //Renders workout in sidebar
        html = `<li class="workout workout--running" data-id=${workout.id}>
                    <h2 class="workout__title">${workout.description}</h2>
                    <div class="workout__details">
                        <span class="workout__icon">🏃‍♂️</span>
                        <span class="workout__value">${workout.distance}</span>
                        <span class="workout__unit">km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">min</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.pace}</span>
                        <span class="workout__unit">min/km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${workout.cadence}</span>
                        <span class="workout__unit">spm</span>
                    </div>
                </li>`

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

    } else if (type === 'cycling') {

        //Renders workout in sidebar
        html =  `<li class="workout workout--cycling" data-id=${workout.id}>
                    <h2 class="workout__title">${workout.description}</h2>
                    <div class="workout__details">
                        <span class="workout__icon">🚴‍♀️</span>
                        <span class="workout__value">${workout.distance}</span>
                        <span class="workout__unit">km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">min</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.speed}</span>
                        <span class="workout__unit">km/h</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⛰</span>
                        <span class="workout__value">${workout.elevation}</span>
                        <span class="workout__unit">m</span>
                    </div>
                </li>`

        //Make marker at coords where user clicked
        L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            maxWidth:250,
            minWidth:100,
            autoClose:false,
            closeOnClick:false,
            className:'cycling-popup',
        }))
        .setPopupContent('workout')
        .openPopup();

    }

    //Displays new workout after to from
    form.insertAdjacentHTML("afterend", html);

    //Resets Values
    form.reset();

})


//Event Listener Toggle form input type change.
inputType.addEventListener('change', function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
 })


//Event Listener To check if clicked on marker.
containerWorkouts.addEventListener('click', function(e){

    //Selects the Workout class
    const workoutEl = e.target.closest('.workout');

    //If Workout class isn't found
    if (!workoutEl) return;

    const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

    map.setView(workout.coords, 13, {

        //Set map view to workout coords
        animate: true,
        pan: {
            duration: 1,
        },

    });

});