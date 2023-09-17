'use strict';

const API_KEY = '1175470757064246b83173445231409';

//State object to control UI elements.
//Has the option to register a listener that updates CSS 
let loadingState = {
	stateInternal: '',
	listener: function() {},
	set state(newState) {
		this.stateInternal = newState;
		this.listener(newState);
	},
	get state() {
		return this.stateInternal;
	},
	registerListener: function(listener) {
		this.listener = listener;
	}
}

let weatherData;

const getWeatherData = async (location) => {
	console.log(location);
	let url = 'https://api.weatherapi.com/v1/forecast.json?key=' +
		API_KEY + '&q=' + location + '&days=3&aqi=no&alerts=no';
	const response = await fetch(url, { mode: 'cors' });
	const digestedRes = await response.json();
	return digestedRes;
}

const parseWeatherData = (weatherData) => {
	const today = weatherData.forecast.forecastday[0];
	const tomorrow = weatherData.forecast.forecastday[1];
	const afterTomorrow = weatherData.forecast.forecastday[2];

	const mapDayForecast = (currentDay) => {
	return {
		avgTempC: currentDay.day.avgtemp_c,
		avgTempF: currentDay.day.avgtemp_f,
		maxTempC: currentDay.day.maxtemp_c,
		maxTempF: currentDay.day.maxtemp_f,
		minTempC: currentDay.day.mintemp_c,
		minTempF: currentDay.day.mintemp_f,
		chanceOfRain: currentDay.day.daily_chance_of_rain,
		chanceOfSnow: currentDay.day.daily_chance_of_snow,
		condition: currentDay.day.condition.text
	}
	}

	return {
	forecast: {
		today: mapDayForecast(today),
		tomorrow: mapDayForecast(tomorrow),
		afterTomorrow: mapDayForecast(afterTomorrow)            
	},
	location: {
		country: weatherData.location.country,
		name: weatherData.location.name,
		region: weatherData.location.region
	}
	}
}

//Dom Manipulation
const locationInput = document.getElementById('location');
const submitButton = document.querySelector('.submit-button');
const loadDisplay = document.querySelector('.load-display')
const weather = document.querySelector('.weather');

let forecast = {
	tomorrow : {
		node: document.querySelector('div.tomorrow'),
		h2: document.querySelector('div.tomorrow>h2'),
		temperatureF: document.querySelector('div.tomorrow>.temp-f'),
	},
}

loadingState.registerListener((value) => {
	switch (value) {
		case 'loading':
			loadDisplay.classList.add('loading');
			break;
		case 'loaded':
			loadDisplay.classList.remove('loading');
			break;
		default:
			loadDisplay.classList.remove('loading');
			break;
	}
})

submitButton.addEventListener('click', async (e) => {
	e.preventDefault();
	const state = loadingState.state;
	if (locationInput.value == '') {
		alert('Please provide a location.');
		return;
	}
	if (state === 'loading') {
		return;
	}
	if (state === '' || state === 'loaded') {
		loadingState.state = 'loading';
		weather.classList.toggle('active', true);
		const data = await getWeatherData(locationInput.value);
		weatherData = parseWeatherData(data);
		return loadingState.state = 'loaded';
	}
});
