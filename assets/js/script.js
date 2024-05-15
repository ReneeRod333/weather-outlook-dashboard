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
    const city = {id, name};
    const cities = getCities();
    cities.push(city);
    savedCities(cities);
    cityInput.val('');
    renderSearchHistory();
}

function renderSearchHistory() {
    const cities = getCities();
    const historyList = $('#historyList');
    historyList.empty();
    for (const city of cities) {
        const li = $("<li class='list-group-item d-flex justify-content-between rounded-pill align-items-start'></li>");
        li.attr('data-city-id', city.id);
        const div1 = $("<div class='ms-2 me-auto'></div");
        const div2 = $("<div class='fw-bold'>Subheading</div>");
        div2.text(city.name);
        const closeButton = $("<button type='button' class='btn-close' aria-label='Close'></button>");
        closeButton.on('click', deleteCity);
        div1.append(div2);
        li.append(div1);
        li.append(closeButton);
        li.on('click', function() {console.log('clicked li')})
        historyList.append(li);        
    }
}

function deleteCity(event) {
    const closeButton = $(event.target);
    const li = closeButton.parent();
    const cityId = li.attr("data-city-id");
    const cities = getCities();
    const filteredCities = cities.filter(city => city.id !== parseInt(cityId));
    savedCities(filteredCities);
    renderSearchHistory();
}

function renderAPI() {

}

function renderCurrentWeather() {

}

function renderForecastWeather() {

}

$(document).ready(function () {
    const searchButton = $('#searchButton');
    searchButton.on('click', addNewCity);
    renderSearchHistory();
});








