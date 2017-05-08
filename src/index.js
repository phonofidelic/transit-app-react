import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';
import App from './App';
import './index.css';

const inspector = window.window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(rootReducer, inspector);

// let store = createStore(rootReducer)

render(
	<Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
);
