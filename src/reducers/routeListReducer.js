import { REQUEST_ROUTES, RECIEVE_ROUTES } from '../actiontypes';

const INITIAL_STATE = { isFetching: false, routes: [] };

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
				isFetching: false,
				routes: action.payload,
				lastUpdated: action.receivedAt
			}

		default:
			return state;
	}
}

export default routeListReducer