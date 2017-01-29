import { createStore, combineReducers } from 'redux';
import auth from './reducers/auth';
import loading from './reducers/loading';

export default createStore(
  combineReducers({
    auth,
    loading
  })
);
