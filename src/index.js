import './index.scss';
import displayInputResults from './components/resultList/resultList';
import state from './state';
import getWeather from './openweather';

// Weather api supported languages
const supportedLanguages = ['af', 'al', 'ar', 'az', 'bg', 'ca', 'cz', 'da',
  'de', 'el', 'en', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hi', 'hr', 'hu',
  'id', 'it', 'ja', 'kr', 'la', 'lt', 'mk', 'no', 'nl', 'pl', 'pt', 'pt_br',
  'ro', 'ru', 'sv', 'se', 'sk', 'sl', 'sp', 'es', 'sr', 'th', 'tr', 'ua', 'uk',
  'vi', 'zh_cn', 'zh_tw', 'zu'];

// DOM elements
const searchButton = document.querySelector('#searchPlace');
const radioButtons = [...document.querySelector('#setUnits')];

// Event listeners
searchButton.addEventListener('click', displayInputResults);
radioButtons.forEach((radio) => radio.addEventListener('click', setUnits));

// Initialization
getUserLanguage();
getWeather(state.getState());

function getUserLanguage() {
  const userLang = navigator.language.slice(0, 2);
  const setLanguage = supportedLanguages.includes(userLang) ? userLang : 'en';
  state.setData(setLanguage, 'lang');
}

function setUnits(e) {
  // Get radio units value
  const { value } = e.srcElement;
  const temp = value === 'metric' ? '°C' : '°F';
  const wind = value === 'metric' ? 'm/s' : 'MPH';
  // Save to state
  state.setData(value, 'units');
  // Set new string property depending on units value
  const units = { temp, wind };
  // Save to state
  state.setData(units, 'string');
  getWeather(state.getState());
}
