import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './App';
import './index.css';

// Using create-react-app serviceworker in production
// if('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register('./sw.js')
// 	.then((reg) => {
// 		console.log('Service Worker registered!');
// 	})
// 	.catch((err) => {
// 		console.error('serviceWorker error:', err);
// 	});
// } else {
// 	console.log('serviceWorker not supported!');
// }

const inspector = window.window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(rootReducer, inspector);

// let store = createStore(rootReducer)

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: '#757575'
	}
})

render(
	<Provider store={store}>
		<MuiThemeProvider muiTheme={muiTheme}>
  		<App />
  	</MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
