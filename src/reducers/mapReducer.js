import { UPDATE_MAP_VIEW } from '../actiontypes';

const INITIAL_STATE = {mapCenter: null};

const mapReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE_MAP_VIEW:
			return {
				...state,
				mapCenter: action.payload
			};

		default:
			return state;
	}
}

export default mapReducer;