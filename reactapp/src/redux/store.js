import configureStore from './configureStore'; // Initial Redux Store
import loadState from './loadState';

const store = configureStore();
loadState(store);

export default store;