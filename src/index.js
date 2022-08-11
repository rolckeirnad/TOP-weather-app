import './index.scss';
import displayInputResults from './components/resultList/resultList';
import state from './state';
import events from './events';

// DOM elements
const searchButton = document.querySelector('#searchPlace');

// Event listeners
searchButton.addEventListener('click', displayInputResults);

// Initialization
events.emit('set location', state.getState());
