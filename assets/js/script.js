// Element
var searchBtn = document.querySelector('#search-button');
var searchInput = document.querySelector('#search-input');
var response1Text = document.querySelector('#response-status-1');
var response2Text = document.querySelector('#response-status-2');

// Global variables
var APIKey = '2a4a21cadfdf5f9c20683500f0de1557';
var cityName;
var lat;
var lon;

// 
function getForecastData(data) {
  lat = data.coord.lat;
  lon = data.coord.lat;
  
  var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;

  // 
  fetch(forecastURL)
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        response2Text.textContent = response.status;
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

// 
function getCityData(event) {
  event.preventDefault();

  if (!searchInput.value) {
    window.alert("Please enter a city!")
  } 
  else {
    cityName = searchInput.value;
    
    var cityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    // 
    fetch(cityURL)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          response1Text.textContent = response.status;
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        
        getForecastData(data);
      });
  }
}

// Event Listeners
searchBtn.addEventListener('click', getCityData);
