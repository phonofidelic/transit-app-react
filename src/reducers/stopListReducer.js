import { FETCH_STOPS } from '../actiontypes';;

export const INITIAL_STATE = {
	stops: []
};

const stopListReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FETCH_STOPS:
			return {
				...state,
				stops: action.payload
			}

		default:
			return state
	}
}

export default stopListReducer;