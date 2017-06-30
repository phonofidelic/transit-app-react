import { combineReducers } from 'redux';
import locationReducer from './locationReducer';
import routeListReducer from './routeListReducer';
import mapReducer from './mapReducer';
import stopListReducer from './stopListReducer';
import tripPlannerReducer from './tripPlannerReducer';

const rootReducer = combineReducers({
	locationReducer,
	routeListReducer,
	mapReducer,
	stopListReducer,
	tripPlannerReducer
});

export default rootReducer;