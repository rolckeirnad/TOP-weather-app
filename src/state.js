import events from './events';

function newState() {
  let data = {};

  const getData = (type) => data[type];
  const setData = (newData, type) => { data[type] = newData; };
  const getState = () => ({ ...data });
  const setState = (state) => { data = state; };

  return {
    getData,
    setData,
    getState,
    setState,
  };
}

const defaultData = {
  lat: '19.4326296',
  lon: '-99.1331785',
  units: 'metric',
  string: { temp: '°C', wind: 'm/s' },
  lang: 'en',
  name: 'Mexico City',
  localName: 'Ciudad de México',
  country: 'MX',
};

function updateState(state, action) {
  let obj = state.getState();
  switch (action.type) {
    case 'UPDATE_STATE':
      obj = { ...obj, ...action.state };
      state.setState(obj);
      break;
    default:
      console.error('Not implemented');
  }
}

const state = newState();

state.setState(defaultData);

events.on('save settings', (action) => {
  updateState(state, action);
});

export default state;
