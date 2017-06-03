import { combineReducers } from 'redux';
import userReducer from './userReducer';
import routeListReducer from './routeListReducer';
import mapReducer from './mapReducer';
import stopListReducer from './stopListReducer';

const rootReducer = combineReducers({
	userReducer,
	routeListReducer,
	mapReducer,
	stopListReducer
});

export default rootReducer;