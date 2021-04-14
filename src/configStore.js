import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './view/indexReducer';

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  // console.info('dispatching', action);
  let result = next(action);
  // console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
