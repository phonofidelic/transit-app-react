import { INIT_MAP, MAP_LOADED, UPDATE_MAP_VIEW } from '../actiontypes';

const INITIAL_STATE = {map: null, mapCenter: null, mapLoaded: false};

const mapReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {

		case INIT_MAP: 
			return {
				...state,
				map: action.payload
			};

		case MAP_LOADED:
			return {
				...state,
				mapLoaded: true
			}

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