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

// Event listeners
searchButton.addEventListener('click', displayInputResults);

// Initialization
getUserLanguage();
getWeather(state.getState());

function getUserLanguage() {
  const userLang = navigator.language.slice(0, 2);
  const setLanguage = supportedLanguages.includes(userLang) ? userLang : 'en';
  state.setData(setLanguage, 'lang');
}

events.emit('set location', state.getState());
