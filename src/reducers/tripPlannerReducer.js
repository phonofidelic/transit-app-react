import { 
	SHOW_TRIP_PLANNER,
	HIDE_TRIP_PLANNER,
 	DESTINATION_INPUT_CHANGE ,
 	RECEIVE_AUTOCOMPLETE_RESULTS,
 	SELECT_DESTINATION,
 	RECEIVE_TRIP_DATA
 } from '../actiontypes';

const INITIAL_STATE = {
	showTripPlanner: false,
	destinationInput: null,
	autocompleteResults: [],
	selectedDestination: null,
	tripData: null
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

		case SELECT_DESTINATION:
			return {
				...state,
				selectedDestination: action.payload
			}

		case RECEIVE_TRIP_DATA:
			return {
				...state,
				tripData: action.payload
			}

		default: return state;
	}
}

export default tripPlannerReducer;
