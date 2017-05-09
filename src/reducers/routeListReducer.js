import { GET_NEARBY_ROUTES } from '../actiontypes';

const INITIAL_STATE = { routeList: [] };

const routeListReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_NEARBY_ROUTES:
			return {
				...state,
				routeList: action.payload
			};

		default:
			return state;
	}
}

export default routeListReducer