// Captured Elements
var searchBtn = document.querySelector('#search-button');
var searchInput = document.querySelector('#search-input');
var currentDayForecast = document.querySelector('#forecast-day');

// Global Variables
var APIKey = '2a4a21cadfdf5f9c20683500f0de1557';
var cityName;
var lat;
var lon;

// 
function getForecastData(data) {
  lat = data.coord.lat;
  lon = data.coord.lon;
  
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

// Sets the current day's forecast data on display
function currentForecast(forecastData) {
  console.log('Sixth', forecastData);
  var temp = forecastData.temp;
  var wind = forecastData.wind;
  var humid = forecastData.humidity;
  var date = forecastData.date;
  var icon = forecastData.icon;

  // Creating current day forecast display elements
  var cityTitle = document.createElement('h2');
  var img = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidEl = document.createElement('p');

  cityTitle.textContent = cityName + ' (' + date + ')';
  img.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '.png');
  tempEl.textContent = 'Temperature: ' + temp + '°F';
  windEl.textContent = 'Wind: ' + wind + ' MPH';
  humidEl.textContent = 'Humidity: ' + humid + '%';
  
  cityTitle.appendChild(img);

  // Append the new elements to the display
  currentDayForecast.appendChild(cityTitle);
  currentDayForecast.appendChild(tempEl);
  currentDayForecast.appendChild(windEl);
  currentDayForecast.appendChild(humidEl);
}

// Retrieves current day weather data for the provided city
function getCityData(event) {
  event.preventDefault();

  var forecast = {};

  // Checks to see if the search bar is empty
  if (searchInput.value === '') {
    window.alert("Please enter a city!")
  } 
  else {
    cityName = searchInput.value;
    
    var cityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    // Fetches the city's current day weather data
    fetch(cityURL)
      .then(function (response) {
        console.log(response);
        
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        
        forecast['date'] = dayjs.unix(data.dt).format('dddd, MMM DD');
        forecast['icon'] = data.weather[0].icon;
        forecast['temp'] = data.main.temp;
        forecast['wind'] = data.wind.speed;
        forecast['humidity'] = data.main.humidity;

        lat = data.coord.lat;
        lon = data.coord.lon;
        
        currentForecast(forecast);
      });
  }
}

// Event Listeners
searchBtn.addEventListener('click', getCityData);
