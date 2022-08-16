/* eslint-disable camelcase */
import events from './events';

const iconsSrc = {
  temp: { src: './icons8-thermometer-48.png', alt: 'temperature' },
  feels_like: { src: './icons8-thermometer-48.png', alt: 'feels like' },
  clouds: { src: './icons8-clouds-48.png', alt: 'clouds' },
  pop: { src: './icons8-wet-48.png', alt: 'probability of precipitation' },
};

const icons = require.context(
  './assets/',
  false,
  /\.(png|jpg|jpeg|gif)$/,
);

// DOM
const cityEl = document.querySelector('#heroCity');
const currentDateEl = document.querySelector('#heroDt');
const currentTimeEl = document.querySelector('#heroClock');
const currentWeatherIconEl = document.querySelector('#heroIcon');
const currentWeatherTempEl = document.querySelector('#heroTemp');
const currentWeatherDescEl = document.querySelector('#heroDescription');
const hourlyContainerEl = document.querySelector('#hourlyList');
const dailyContainerEl = document.querySelector('#dailyList');

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
  // We update hourly values
  updateHourlyValues(data);
  // We update daily values
  updateDailyValues(data);
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

function updateHourlyValues(data) {
  const { hourly, string } = data;
  const nodeList = hourly.map((obj) => createHourlyElement(obj, string));
  hourlyContainerEl.replaceChildren(...nodeList);
}

function createHourlyElement(data, string) {
  const {
    dt, weather, temp, feels_like, clouds, pop,
  } = data;
  const setTime = new Date(dt * 1000);
  const iconId = weather[0].icon;
  const iconDes = weather[0].main;
  const hour = setTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
  const objProps = {
    hour, temp: `${temp} ${string.temp}`, feels_like: `${feels_like} ${string.temp}`, clouds: `${clouds} %`, pop: `${Math.round(pop * 100)} %`,
  };
  const imgProps = { hour: { src: `./${iconId}@2x.png`, alt: iconDes }, ...iconsSrc };
  const entries = Object.keys(objProps);
  const el = document.createElement('li');
  // for each entry of entries...
  const nodeList = entries.map((key) => {
    const div = document.createElement('div');
    div.classList.add(key);
    const span = document.createElement('span');
    span.textContent = objProps[key];
    const img = new Image();
    img.src = icons(imgProps[key].src);
    img.setAttribute('alt', imgProps[key].alt);
    div.append(img, span);
    return div;
  });
  el.replaceChildren(...nodeList);
  return el;
}

function updateDailyValues(data) {
  const { daily, lang, string } = data;
  const nodeList = daily.map((obj) => createDailyElement(obj, lang, string));
  dailyContainerEl.replaceChildren(...nodeList);
}

function createDailyElement(data, lang) {
  const {
    dt, weather, temp, clouds, pop,
  } = data;
  const setTime = new Date(dt * 1000);
  const setDay = setTime.toLocaleDateString(lang, { weekday: 'long', day: 'numeric' });

  const el = document.createElement('li');
  const div = document.createElement('div');
  div.className = 'daily-card';
  const pDay = document.createElement('p');
  pDay.className = 'daily-card-name';
  pDay.textContent = setDay;

  const pDayImg = new Image();
  pDayImg.src = icons(`./${weather[0].icon}@2x.png`);

  const pDescription = document.createElement('p');
  const weatherValue = document.createElement('span');
  weatherValue.textContent = weather[0].description;
  pDescription.append(weatherValue);

  const pTemp = document.createElement('p');
  const tempImg = new Image();
  tempImg.src = icons('./icons8-thermometer-48.png');
  tempImg.className = 'daily-card-icon';
  const maxTemp = document.createElement('span');
  maxTemp.textContent = `${temp.max}°`;
  const minTemp = document.createElement('span');
  minTemp.textContent = `${temp.min}°`;
  pTemp.append(tempImg, maxTemp, ' / ', minTemp);

  const pClouds = document.createElement('p');
  const cloudImg = new Image();
  cloudImg.src = icons('./icons8-clouds-48.png');
  cloudImg.className = 'daily-card-icon';
  const cloudPercent = document.createElement('span');
  cloudPercent.textContent = `${clouds} %`;
  const popPercent = document.createElement('span');
  popPercent.textContent = `${Math.round(pop * 100)}%`;
  const popImg = new Image();
  popImg.src = icons('./icons8-wet-48.png');
  popImg.className = 'daily-card-icon';
  pClouds.append(cloudImg, cloudPercent, ' ', popImg, popPercent);

  div.append(pDay, pDayImg, pDescription, pTemp, pClouds);
  el.append(div);
  return el;
}

events.on('set location', getWeather);

export default getWeather;
