import { GET_USER_POS } from '../actiontypes';

const INITIAL_STATE = {userPos: null};

const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_USER_POS:
			return {
				...state,
				userPos: action.payload
			};

		default:
			return state;
	}
}

export default userReducer;