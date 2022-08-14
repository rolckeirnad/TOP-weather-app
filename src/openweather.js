import events from './events';

// DOM
const cityEl = document.querySelector('#heroCity');
const currentDateEl = document.querySelector('#heroDt');
const currentTimeEl = document.querySelector('#heroClock');
const currentWeatherIconEl = document.querySelector('#heroIcon');
const currentWeatherTempEl = document.querySelector('#heroTemp');
const currentWeatherDescEl = document.querySelector('#heroDescription');
const hourlyContainerEl = document.querySelector('#hourlyList');

const detailTempEl = document.querySelector('#detailTemp');
const detailHumidityEl = document.querySelector('#detailHumidity');
const detailCloudsEl = document.querySelector('#detailClouds');
const detailWindEl = document.querySelector('#detailWind');

async function getWeather(obj) {
  // fetch data from API
  const weather = await makeWeatherRequest(obj);
  // Update components
  updateAllValues(weather);
}

async function makeWeatherRequest(obj) {
  const {
    lat, lon, lang, units,
  } = obj;
  const request = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=${lang}&units=${units}&exclude=minutely,alerts&appid=1a6c8450aa871d00b0a6a4970493b465`, { mode: 'cors' });
  const data = await request.json();
  const result = { ...obj, ...data };
  return result;
}

function updateAllValues(data) {
  // We update hero values
  updateHeroValues(data);
}

function updateHeroValues(data) {
  const {
    country, localName, current, lang, string,
  } = data;
  const currentDate = new Date(current.dt * 1000);
  cityEl.textContent = `${localName}, ${country}`;
  currentDateEl.textContent = currentDate.toLocaleString(lang, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  currentTimeEl.textContent = currentDate.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
  currentWeatherIconEl.src = `http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`;
  currentWeatherIconEl.setAttribute('alt', current.weather[0].main);
  currentWeatherTempEl.textContent = `${current.temp} ${string.temp}`;
  currentWeatherDescEl.textContent = current.weather[0].description;

  detailTempEl.textContent = `${current.feels_like} ${string.temp}`;
  detailHumidityEl.textContent = `${current.humidity} %`;
  detailCloudsEl.textContent = `${current.clouds} %`;
  detailWindEl.textContent = `${current.wind_speed} ${string.wind}`;

}

events.on('set location', getWeather);

export default getWeather;
