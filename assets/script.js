

/***********************
 *** NPS API Queries ***
 ***********************/

//Selectors

let stateSelection = document.getElementById('stateSelection');
let activitySelection = document.getElementById('activitySelection');
let resultsContainer = document.getElementById('resultsContainer');
let saveBtn = document.querySelector('.saveBtn');

//global variables
let target;
let result;
let results;
let stateCode;
let activity;
let selectedParks = [];

//Display the results into the Search Results section
let displayResults = function() {

    //Display new results
    for(let i = 0; i < selectedParks.length; i++) {
        
        //Create card for each result
        let resultBox = document.createElement('div');
        resultBox.classList.add('card','result');
        resultBox.setAttribute('data-resnum',i);
        resultsContainer.appendChild(resultBox);

        //Display Park title
        let parkTitle = document.createElement('h5');
        parkTitle.textContent = selectedParks[i].parkName;
        resultBox.appendChild(parkTitle);

        
        let infoList = document.createElement('ul');
        resultBox.appendChild(infoList);

        //Display Website for park
        let parkLink = document.createElement('li');
        parkLink.innerHTML = `URL: <a href='${selectedParks[i].parkURL}' target='_blank'>${selectedParks[i].parkURL}</a>`;
        infoList.appendChild(parkLink);

        let parkLocation = document.createElement('li');
        let address = selectedParks[i].parkAddress.line1 + ', ' + selectedParks[i].parkAddress.city + ', ' + selectedParks[i].parkAddress.stateCode + ' ' + selectedParks[i].parkAddress.postalCode;
        parkLocation.innerHTML = '<a href="https://www.google.com/maps/search/?api=1&query=' + selectedParks[i].parkLat + '%2C' + selectedParks[i].parkLon + '" target="_blank">' + address + '</a>';
        infoList.appendChild(parkLocation);
    }

};

//retrieve info for parks in selected state (address, lat/long, and parkCode) to be able to do other API queries
let getParksInfo = function() {
    let requestURL = "https://developer.nps.gov/api/v1/parks?api_key=0lew12ln17nmn2hAVOHsfsFPOuTsd5Vym9rII7jp&stateCode=" + stateCode;
    fetch(requestURL)
        .then(function(response) {
            if (response.status === 200) {
                //if yes, convert to object
                return response.json();
            } else {
                //if no, tell user that their search criteria wasn't found
                alert('No results found');
                return;
            }
        })
        .then(function(data) {

            //get just the data array from the promise
            results = data.data;

            //sift through each result to see if the park has the activity the user selected
            for(let i = 0; i < results.length; i++) {
                for(let k = 0; k < results[i].activities.length; k++) {
                    //if it includes the activity, store info about park as an object inside the selectedParks array
                    if(results[i].activities[k].name === activity) {
                        let parkObject = {
                            parkCode: results[i].parkCode,
                            parkName: results[i].fullName,
                            parkLat: results[i].latitude,
                            parkLon: results[i].longitude,
                            parkURL: results[i].url,
                            parkAddress: results[i].addresses[0]
                        }
                        selectedParks.push(parkObject);
                    }
                }
            }
            displayResults();
        });
};

//Destroy past results from page and array
let destroyResults = function() {

    //Destroy previous results from DOM
    while(resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
    }

    //Destroy results from selectedParks array
    selectedParks.splice(0,selectedParks.length);
};

let getWebCam = function() {

};

/****************************
 * OPEN WEATHER API QUERIES *
 ****************************/

let getWeather = function() {
    let weatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + clickedPark.parkLat + '&lon=' + clickedPark.parkLon + '&exclude=hourly,minutely,alerts&appid=3e8fd441ffe94cd1d1f73c4d27b77283';
    console.log(weatherURL);
};

//Event Listeners

//Perform Search
saveBtn.addEventListener('click',function(event) {
    event.preventDefault();

    stateCode = stateSelection.value;
    activity = activitySelection.value;

    destroyResults();
    getParksInfo();
});

//Show Map, Weather, and webcam image of park
resultsContainer.addEventListener('click', function(event) {
    clickedPark = selectedParks[event.target.dataset.resnum];
    getWeather();
    getWebCam();
});


let resetBtn = document.querySelector(".resetBtn");
resetBtn.addEventListener("click", refreshPage)
function refreshPage() {
    window.location.reload();
 } 
