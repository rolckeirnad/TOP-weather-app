import './index.scss';

// DOM elements
const inputPlace = document.querySelector('#inputPlace');
const resultList = document.querySelector('#results');
const searchButton = document.querySelector('#searchPlace');

// Event listeners
searchButton.addEventListener('click', displayInputResults);

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

function createInputRadio(index, name, result) {
  const { lat, lon } = result;
  const input = document.createElement('input');
  input.setAttribute('type', 'radio');
  input.setAttribute('id', `radio${index}`);
  input.setAttribute('name', name);
  input.dataset.lat = lat;
  input.dataset.lon = lon;
  input.addEventListener('click', saveLocation);
  return input;
}

function createLabel(index, obj) {
  const { name, country } = obj;
  const label = document.createElement('label');
  label.setAttribute('for', `radio${index}`);
  label.textContent = `Country: ${country}, Name: ${name}`;
  return label;
}

function saveLocation(e) {
  const { lat, lon } = e.srcElement.dataset;
  // get pending options for units and lang
  // Save to local storage

  // Fire event to fetch weather...
  // Make API call to fetch weather
  console.log(lat, lon); // e.srcElement.dataset
}
