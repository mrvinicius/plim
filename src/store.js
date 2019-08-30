import { createStore } from 'redux';
import appReducer from './app.reducer';

export default createStore(appReducer);