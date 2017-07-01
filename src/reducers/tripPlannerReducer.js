import { 
	SHOW_TRIP_PLANNER,
	HIDE_TRIP_PLANNER,
 	DESTINATION_INPUT_CHANGE ,
 	RECEIVE_AUTOCOMPLETE_RESULTS
 } from '../actiontypes';

const INITIAL_STATE = {
	showTripPlanner: false,
	destinationInput: null,
	autocompleteResults: []
};

const tripPlannerReducer = (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case SHOW_TRIP_PLANNER:
			return {
				...state,
				showTripPlanner: true
			}

		case HIDE_TRIP_PLANNER:
			return {
				...state,
				showTripPlanner: false
			}

		case DESTINATION_INPUT_CHANGE:
			return {
				...state,
				destinationInput: action.payload
			}

		case RECEIVE_AUTOCOMPLETE_RESULTS:
			return {
				...state,
				autocompleteResults: action.payload
			}

		default: return state;
	}
}

export default tripPlannerReducer;
