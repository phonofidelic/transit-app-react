import { REQUEST_ROUTES, 
				 RECIEVE_ROUTES, 
				 SET_ROUTE_COLORS,
				 SELECT_ROUTE,
				 FETCH_ROUTES_ERROR } from '../actiontypes';

export const INITIAL_STATE = { 
	isFetching: false, 
	colorsSet: false, 
	routes: [],
	selectedRoute: null,
	error: null
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

		case SELECT_ROUTE:
			return {
				...state,
				routes: action.payload
			}

		case FETCH_ROUTES_ERROR:
			return {
				...state,
				isFetching: false,
				error: action.payload
			}

		default:
			return state;
	}
}

export default routeListReducer;