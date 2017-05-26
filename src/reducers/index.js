import { combineReducers } from 'redux';
import userReducer from './userReducer';
import routeListReducer from './routeListReducer';
import mapReducer from './mapReducer';

const rootReducer = combineReducers({
	userReducer,
	routeListReducer,
	mapReducer
});

export default rootReducer;