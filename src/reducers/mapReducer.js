import { 
	INIT_MAP, 
	MAP_LOADED, 
	UPDATE_MAP_VIEW, 
	SET_DEST_MARKER } from '../actiontypes';

const INITIAL_STATE = {
	map: null, 
	mapCenter: null, 
	mapLoaded: false,
	destMarker: null
};

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

		case SET_DEST_MARKER:
			return {
				...state,
				destMarker: action.payload
			}

		default:
			return state;
	}
}

export default mapReducer;