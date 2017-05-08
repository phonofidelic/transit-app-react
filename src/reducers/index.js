import { combineReducers } from 'redux';
import userReducer from './userReducer';
import routeListReducer from './routeListReducer';

const rootReducer = combineReducers({
	userReducer,
	routeListReducer
});

export default rootReducer;