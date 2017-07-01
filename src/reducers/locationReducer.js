import { GET_USER_POS, SET_DESTINATION } from '../actiontypes';

const INITIAL_STATE = {
	userPos: null,
	destination: null
};

const locationReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_USER_POS:
			return {
				...state,
				userPos: action.payload
			};

		case SET_DESTINATION:
			return {
				...state,
				destination: action.payload
			}

		default:
			return state;
	}
}

export default locationReducer;