import { REQUEST_ROUTES, 
				 RECIEVE_ROUTES, 
				 SET_ROUTE_COLORS } from '../actiontypes';

export const INITIAL_STATE = { 
	isFetching: false, 
	colorsSet: false, 
	routes: [] 
};

const routeListReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REQUEST_ROUTES:
			return {
				...state,
				isFetching: true
			};

		case RECIEVE_ROUTES:
			return {
				...state,
				// isFetching: false,
				routes: action.payload,
				lastUpdated: action.recievedAt
			}

		case SET_ROUTE_COLORS:
			return {
				...state,
				colorsSet: true,
				isFetching:false,
				routes: action.payload
			}

		default:
			return state;
	}
}

export default routeListReducer