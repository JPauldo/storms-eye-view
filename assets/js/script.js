// Captured Elements
var searchBtn = document.querySelector('#search-button');
var searchInput = document.querySelector('#search-input');
var currentDayForecast = document.querySelector('#forecast-day');
var forecastList = document.querySelector('#forecast-week');
var cityList = document.querySelector('#city-list');

// Global Variables
var APIKey = '2a4a21cadfdf5f9c20683500f0de1557';
var cityName;
var lat;
var lon;
var cities;

// Sets the cities based on past searches in local storage
function setCities() {
  cities = JSON.parse(localStorage.getItem('cities'));
  
  // If there was nothing in local storage, creates an empty array
  if (cities === null) {
    cities = [];
  }
}

// Puts the data necessary for the city's API call into local storage
function storeCityData() {
  var cityData = {
    name: cityName,
    latitude: lat,
    longitude: lon
  }
  console.log(cityData);
  console.log(cities);

  // Checks to see if the city's data is already in local storage
  if (!cities.some(el => el.name === cityName)) {
    cities.push(cityData);

    localStorage.setItem('cities', JSON.stringify(cities));
  }
}

// Shows past cities searched
function displaySearchHistory() {
  cityList.innerHTML = '';

  // If they exist, iterates on the past searched cities
  if (cities) {
    cities.forEach(cityInfo => {
      var li = document.createElement('li');
      
      li.setAttribute('class', 'btn btn-secondary my-2');
      li.setAttribute('style', 'width: 100%;')
      li.setAttribute('data-name', cityInfo.name);
      li.setAttribute('data-latitude', cityInfo.latitude);
      li.setAttribute('data-longitude', cityInfo.longitude);

      li.textContent = cityInfo.name;

      // Appends the list item to the display
      cityList.appendChild(li);
    });
  }
}

// Sets the current day's weather data on display
function displayCurrentForecast(weatherData) {
  currentDayForecast.innerHTML = '';
  
  console.log('Sixth', weatherData);
  var temp = weatherData.temp;
  var wind = weatherData.wind;
  var humid = weatherData.humidity;
  var date = weatherData.date;
  var icon = weatherData.icon;

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

  // Appends the new elements to the display
  cityTitle.appendChild(img);
  currentDayForecast.appendChild(cityTitle);
  currentDayForecast.appendChild(tempEl);
  currentDayForecast.appendChild(windEl);
  currentDayForecast.appendChild(humidEl);
}

// Displays the five day forecast
function displayWeekForecast(forecastData) {
  forecastList.innerHTML = '';
  
  // Sets the weather data for every day
  // Note: Each day is broken up into three hours intervals
  for (var i = 7; i < forecastData.length; i += 8) {
    var temp = forecastData[i].main.temp;
    var wind = forecastData[i].wind.speed;
    var humid = forecastData[i].main.humidity;
    var date = dayjs.unix(forecastData[i].dt).format('dddd, MMM DD');
    var icon = forecastData[i].weather[0].icon;

    // Creating element for the day's data
    var li = document.createElement('li');
    var h4 = document.createElement('h5');
    var img = document.createElement('img');
    var pTemp = document.createElement('p');
    var pWind = document.createElement('p');
    var pHumid = document.createElement('p');

    li.setAttribute('class', 'col pt-2 mx-1 rounded');
    h4.textContent = cityName + ' (' + date + ')';
    img.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '.png');
    pTemp.textContent = 'Temp: ' + temp + '°F';
    pWind.textContent = 'Wind: ' + wind + ' MPH';
    pHumid.textContent = 'Humidity: ' + humid + '%';

    // Appends the new elements for display
    li.appendChild(h4);
    li.appendChild(img);
    li.appendChild(pTemp);
    li.appendChild(pWind);
    li.appendChild(pHumid);
    forecastList.appendChild(li);
  }
}

// Retrieves the given city's forecast data for the next five days
function getFiveDayForecast() {
  var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;

  // Calls the 5-day forecast API
  fetch(forecastURL)
    .then(function (response) {
      console.log(response);
      // Checks to see if the response is valid
      if(response.status === 200) {
        return response.json();
      }
      else {
        alert('Something is wrong with the data provided. Got a response of ' + response.status + '. Please try again.');
        cityName = '';
      }
    })
    .then(function (data) {
      console.log(data);
      
      displayWeekForecast(data.list);
      cityName = '';
    });
}

// Retrieves the given city's weather for current day
function getCityWeather(event) {
  var forecast = {};

  // 
  if (cityName === '' && searchInput.value !== '') {
    event.preventDefault();

    cityName = searchInput.value;
  }
    
  var cityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

  // Calls current day weather API
  fetch(cityURL)
    .then(function (response) {
      // Checks to see if the response is valid
      if(response.status === 200) {
        return response.json();
      }
      else {
        alert('Please enter a valid cityName');
        cityName = '';
      }
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
      
      displayCurrentForecast(forecast);
      
      storeCityData();
      getFiveDayForecast();
    });
}

// Restrieves the city data stored in the buttons data attributes
function getCityData(event) {
  cityName = event.target.dataset.name;
  lat = event.target.dataset.latitude;
  lon = event.target.dataset.longitude;

  getCityWeather(event);
}

// Initial Function Calls
setCities();
displaySearchHistory();

// Event Listeners
searchBtn.addEventListener('click', getCityWeather);
cityList.addEventListener('click', getCityData);
