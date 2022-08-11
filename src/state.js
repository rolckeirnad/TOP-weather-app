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

const initialData = {
  lat: '19.4326296',
  lon: '-99.1331785',
  units: 'metric',
  lang: 'en',
};

const state = newState();

state.setState(initialData);

events.on('set location', state.setState);

export default state;
