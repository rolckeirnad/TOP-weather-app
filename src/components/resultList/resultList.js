import './resultList.scss';
import events from '../../events';
import state from '../../state';

// DOM elements
const inputPlace = document.querySelector('#inputPlace');
const resultList = document.querySelector('#results');

function displayInputResults() {
  // Format input for API call
  const searchValue = encodeURIComponent(inputPlace.value);
  // Make API call
  getLocation(searchValue).then((data) => {
    // Display some form with returned values from API
    const newList = createList(data);
    resultList.replaceChildren(newList);
    resultList.classList.remove('hide');
  }).catch((err) => {
    // We could display a message with an error inside result list
    console.error(err);
  });
  inputPlace.value = '';
}

async function getLocation(search) {
  const request = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=1a6c8450aa871d00b0a6a4970493b465`, { mode: 'cors' });
  const response = await request.json();
  return response;
}

function createList(data) {
  const ul = document.createElement('ul');
  const nodeList = data.map((result, index) => {
    const li = document.createElement('li');
    const input = createInputRadio(index, 'results', result);
    const label = createLabel(index, result);
    li.append(input, label);
    return li;
  });
  ul.replaceChildren(...nodeList);
  return ul;
}

function createInputRadio(index, radioName, result) {
  const {
    lat, lon, country, name, local_names,
  } = result;
  const lang = state.getData('lang');
  const input = document.createElement('input');
  input.setAttribute('type', 'radio');
  input.setAttribute('id', `radio${index}`);
  input.setAttribute('name', radioName);
  input.dataset.lat = lat;
  input.dataset.lon = lon;
  input.dataset.country = country;
  input.dataset.name = name;
  if (local_names) {
    input.dataset.localName = local_names[lang] ? local_names[lang] : name;
  } else {
    input.dataset.localName = name;
  }
  input.addEventListener('click', saveLocation);
  return input;
}

function createLabel(index, obj) {
  const { name, country, local_names } = obj;
  const lang = state.getData('lang');
  let labelName;
  if (local_names) {
    labelName = local_names[lang] ? local_names[lang] : name;
  } else {
    labelName = name;
  }
  const label = document.createElement('label');
  label.setAttribute('for', `radio${index}`);
  label.textContent = `${country}, ${labelName}`;
  return label;
}

function saveLocation(e) {
  const obj = {
    type: 'UPDATE_STATE',
    state: e.srcElement.dataset,
  };
  // Save to local storage
  events.emit('save settings', obj);
  // Fire event to fetch weather...
  events.emit('set location', state.getState()); // Make API call to fetch weather
  resultList.classList.add('hide');
  resultList.replaceChildren();
}

export default displayInputResults;
