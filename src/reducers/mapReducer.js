import { 
	INIT_MAP, 
	MAP_LOADED,
	ZOOM_IN,
	ZOOM_OUT,
	CENTER_ON_USER_POS,
	CENTER_ON_COORDS,
	SET_MAP_ROUTES,
	UPDATE_MAP_VIEW, 
	SET_DEST_MARKER,
	SET_TRIP_LINE,
	MAP_ERROR } from '../actiontypes';

const INITIAL_STATE = {
	map: null, 
	mapCenter: null,
	mapLoading: false,
	destMarker: null,
	focusMarker: null,
	tripLine: null,
	error: null
};

const mapReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {

		case INIT_MAP: 
			return {
				...state,
				mapLoading: true
				// map: action.payload				
			};

		case MAP_LOADED:
			return {
				...state,
				mapLoading: false,
				map: action.payload
			}

		case ZOOM_IN:
			return {
				...state,
				map: action.payload
			}

		case ZOOM_OUT:
			return {
				...state,
				map: action.payload
			}

		case CENTER_ON_USER_POS:
			return {
				...state,
				map: action.payload
			}

		case CENTER_ON_COORDS:
			return {
				...state,
				map: action.map,
				focusMarker: action.focusMarker
			}

		case SET_MAP_ROUTES:
			return {
				...state,
				map: action.payload
			}

		case UPDATE_MAP_VIEW:
			return {
				...state,
				mapCenter: action.payload
			}

		case SET_DEST_MARKER:
			return {
				...state,
				destMarker: action.payload
			}

		case SET_TRIP_LINE:
			return {
				...state,
				tripLine: action.payload
			}

		case MAP_ERROR:
			return {
				...state,
				mapLoading: false,
				error: action.payload
			}

		default:
			return state;
	}
}

export default mapReducer;