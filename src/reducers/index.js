import { combineReducers } from 'redux';
import userReducer from './userReducer';
import routeListReducer from './routeListReducer';
import mapReducer from './mapReducer';
import stopListReducer from './stopListReducer';
import tripPlannerReducer from './tripPlannerReducer';

const rootReducer = combineReducers({
	userReducer,
	routeListReducer,
	mapReducer,
	stopListReducer,
	tripPlannerReducer
});

export default rootReducer;