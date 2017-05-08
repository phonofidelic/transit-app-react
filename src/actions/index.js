import axios from 'axios';
import { 
	GET_USER_POS, 
	UPDATE_MAP_VIEW 
} from '../actiontypes';
const L = window.L;
// const L = require('leaflet/dist/leaflet');
// require('leaflet.locatecontrol');

export const getUserPos = () => {
	return (dispatch) => {
		console.log('test')
		let position = [];
		
		navigator.geolocation.getCurrentPosition((pos) => {
			
			position.push(pos.coords.latitude, pos.coords.longitude);

			console.log('position:', position);

			dispatch({
				type: GET_USER_POS,
				payload: position
			})
		})
	}
}

