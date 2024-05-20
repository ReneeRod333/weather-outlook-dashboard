const apiKey = "f39b8362e470dd8ca1c84cea6f103b60";
const baseIconUrl = `https://openweathermap.org/img/wn/`;

// Saves cities to local Storage
function savedCities(cities) {
    localStorage.setItem("cities", JSON.stringify(cities));
}

// Gets cities from local storage
function getCities() {
    const cities = JSON.parse(localStorage.getItem("cities"));
    return cities || [];
}

// Function to generate city Identifier
function generateCityId() {
    const cities = getCities();
    if (cities && cities.length) {
        return cities.length + 1;
    } else {
        return 1;
    }
}

// Function to add a new city
function addNewCity(event) {
    const id = generateCityId();
    const cityInput = $('#searchCity');
    const name = cityInput.val();
    const city = { id, name };
    const cities = getCities();
    cities.push(city);
    savedCities(cities);
    cityInput.val('');
    callCityForecastAPI(city.name);
    callCityCurrentWeatherAPI(city.name);
    renderSearchHistory();
}

// Function to render search history
function renderSearchHistory() {
    const cities = getCities();
    const historyList = $('#historyList');
    historyList.empty();
    for (const city of cities) {
        const li = $("<li class='list-group-item d-flex justify-content-between btn-warning rounded-pill align-items-start'></li>");
        li.attr('data-city-id', city.id);
        const div1 = $("<div class='ms-2 me-auto'></div");
        const div2 = $("<div class='fw-bold'>Subheading</div>");
        div2.text(city.name);
        const closeButton = $("<button type='button' class='btn-close btn-light' aria-label='Close'></button>");
        closeButton.on('click', deleteCity);
        div1.append(div2);
        li.append(div1);
        li.append(closeButton);
        historyList.append(li);
        li.on('click', function liClick() {
            callCityCurrentWeatherAPI(city.name);
            callCityForecastAPI(city.name);
        });
    }
}

// Function to delete city from search history
function deleteCity(event) {
    const closeButton = $(event.target);
    const li = closeButton.parent();
    const cityId = li.attr("data-city-id");
    const cities = getCities();
    const filteredCities = cities.filter(city => city.id !== parseInt(cityId));
    savedCities(filteredCities);
    renderSearchHistory();
}

// Function to call forecast city API
async function callCityForecastAPI(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=imperial&q=${city},us`;
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    try {
        const response = await fetch(apiUrl, requestOptions);
        const rawForecastWeather = await response.json();
        renderForecastWeather(rawForecastWeather);
    } catch (error) {
        console.log({ error });
    }

}

// Function to call current city API
async function callCityCurrentWeatherAPI(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=imperial&q=${city},us`;
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    try {
        const response = await fetch(apiUrl, requestOptions);
        const rawApiData = await response.json();
        renderCurrentWeather(rawApiData);
    } catch (error) {
        console.log({ error });
    }
}

// Function to render current city data
function renderCurrentWeather(rawApiData) {
    const cityCurrentWeatherDiv = $('#cityCurrentWeather');
    cityCurrentWeatherDiv.empty();
    const currentWeather = {
        status: rawApiData.weather[0].main,
        statusDescription: rawApiData.weather[0].description,
        statusIcon: `${baseIconUrl}${rawApiData.weather[0].icon}@2x.png`,
        temp: rawApiData.main.temp,
        humidity: rawApiData.main.humidity,
        windSpeed: rawApiData.wind.speed,
        cityName: rawApiData.name,
        currentDate: new Date().toDateString(),
    };
   
    const container = $('<div class="col-lg-4 p-4 rounded bg-white"></div>');
    const cityNameDiv = $('<h2 class="row p-1 justify-content-center"></h2>');
    const currentDateDiv = $('<div class="row justify-content-center p-2"></div>');
    const currentWeatherIconDiv = $('<div class="row justify-content-center p-2"></div>');
    const iconImg = $('<img class="imgIcon rounded-pill" />')
    const currentWeatherStatusDiv = $('<div class="row p-2"></div>');
    const currentWeatherStatusDescriptionDiv = $('<div class="row p-2"></div>');
    const currentTempDiv = $('<div class="row p-2"></div>');
    const currentWindSpeedDiv = $('<div class="row p-2"></div>');
    const currentHumidityDiv = $('<div class="row p-2"></div>');

    cityNameDiv.text(currentWeather.cityName);
    currentDateDiv.text(currentWeather.currentDate);
    iconImg.attr('src', currentWeather.statusIcon);
    currentWeatherStatusDiv.text(currentWeather.status);
    currentWeatherStatusDescriptionDiv.text(currentWeather.statusDescription);
    currentTempDiv.html(`Temp: ${currentWeather.temp} &deg;F`);
    currentWindSpeedDiv.text(`Wind: ${currentWeather.windSpeed} MPH`);
    currentHumidityDiv.text(`Humidity: ${currentWeather.humidity}%`);

    container.append(cityNameDiv);
    container.append(currentDateDiv);
    currentWeatherIconDiv.append(iconImg);
    container.append(currentWeatherIconDiv);
    container.append(currentWeatherStatusDiv);
    container.append(currentWeatherStatusDescriptionDiv);
    container.append(currentTempDiv);
    container.append(currentWindSpeedDiv);
    container.append(currentHumidityDiv);
    cityCurrentWeatherDiv.append(container);
}

// Function to render forecast city data
function renderForecastWeather(rawApiDataForecast) {
    const cityForecastWeatherdiv = $('#cityForecastWeather');
    cityForecastWeatherdiv.empty();
    const forecastHeading = $('<h2 class="p-4">5 Day Forecast:</h2>');
    cityForecastWeatherdiv.append(forecastHeading);

    for (let index = 3; index < rawApiDataForecast.list.length; index += 8) {
        const forecastWeather = {
            forecastDate: new Date(rawApiDataForecast.list[index].dt * 1000).toDateString(),
            statusIcon: `${baseIconUrl}${rawApiDataForecast.list[index].weather[0].icon}@2x.png`,
            status: rawApiDataForecast.list[index].weather[0].main,
            statusDescription: rawApiDataForecast.list[index].weather[0].description,
            temp: rawApiDataForecast.list[index].main.temp,
            humidity: rawApiDataForecast.list[index].main.humidity,
            windSpeed: rawApiDataForecast.list[index].wind.speed,
        };
        console.log({forecastWeather})
        const container = $('<div class="col-lg-2 ms-auto p-3 bg-white text-center rounded"></div>');
        const forecastDateDiv = $('<div class="row justify-content-center p-1"></div>');
        const forecastWeatherIconDiv = $('<div class="row justify-content-center p-1"></div>');
        const iconImg = $('<img class="imgIcon rounded-pill" />')
        const forecastWeatherStatusDiv = $('<div class="row p-1"></div>');
        const forecastWeatherStatusDescriptionDiv = $('<div class="row p-1"></div>');
        const forecastTempDiv = $('<div class="row p-1"></div>');
        const forecastHumityDiv = $('<div class="row p-1"></div>');
        const forecastWindSpeedDiv = $('<div class="row p-1"></div>');

        forecastDateDiv.text(forecastWeather.forecastDate);
        iconImg.attr('src', forecastWeather.statusIcon);
        forecastWeatherStatusDiv.text(forecastWeather.status);
        forecastWeatherStatusDescriptionDiv.text(forecastWeather.statusDescription);
        forecastTempDiv.html(`Temp: ${forecastWeather.temp} &deg;F`);
        forecastWindSpeedDiv.text(`Wind: ${forecastWeather.windSpeed} MPH`);
        forecastHumityDiv.text(`Humidity: ${forecastWeather.humidity}%`);

        container.append(forecastDateDiv);
        forecastWeatherIconDiv.append(iconImg);
        container.append(forecastWeatherIconDiv);
        container.append(forecastWeatherStatusDiv);
        container.append(forecastWeatherStatusDescriptionDiv);
        container.append(forecastTempDiv);
        container.append(forecastHumityDiv);
        container.append(forecastWindSpeedDiv);
        cityForecastWeatherdiv.append(container);
    }
}

// When page loads, adds event listeners and renders search history.
$(document).ready(function () {
    const searchButton = $('#searchButton');
    searchButton.on('click', addNewCity);
    renderSearchHistory();
});

function weatherStatus () {
}


