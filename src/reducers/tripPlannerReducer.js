import { SHOW_TRIP_PLANNER } from '../actiontypes';

const INITIAL_STATE = {
	showTripPlanner: false
};

const tripPlannerReducer = (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case SHOW_TRIP_PLANNER:
			return {
				...state,
				showTripPlanner: !state.showTripPlanner
			}

		default: return state;
	}
}

export default tripPlannerReducer;
