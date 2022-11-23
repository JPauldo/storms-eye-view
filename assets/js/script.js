// Captured Elements
var searchBtn = document.querySelector('#search-button');
var searchInput = document.querySelector('#search-input');
var currentDayForecast = document.querySelector('#forecast-day');
var forecastList = document.querySelector('#forecast-week');

// Global Variables
var APIKey = '2a4a21cadfdf5f9c20683500f0de1557';
var cityName;
var lat;
var lon;

// Displays the forecast data for next five days
function weekForecast(forecastData) {
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

    // Appending the new elements for display
    li.appendChild(h4);
    li.appendChild(img);
    li.appendChild(pTemp);
    li.appendChild(pWind);
    li.appendChild(pHumid);
    forecastList.appendChild(li);
  }
}

// Retrieves forecast data for the next five days
function getForecastData() {
  var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;

  // Calls the 5-day forecast API
  fetch(forecastURL)
    .then(function (response) {
      console.log(response);

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      
      weekForecast(data.list);
      cityName = '';
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

  // Append the new elements to the display
  cityTitle.appendChild(img);
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

    // Calls current day weather API
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
        
        getForecastData();
      });
  }
}

// Event Listeners
searchBtn.addEventListener('click', getCityData);
