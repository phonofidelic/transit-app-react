import axios from 'axios';
import { 
	GET_USER_POS, 
	UPDATE_MAP_VIEW 
} from '../actiontypes';
const L = window.L;
// const L = require('leaflet/dist/leaflet');
// require('leaflet.locatecontrol');

const getUserPos = () => {
	return (dispatch) => {
		console.log('test')
		let position = [];
		
		navigator.geolocation.getCurrentPosition((pos) => {
			
			position.push(pos.coords.latitude, pos.coords.longitude);

			console.log('position:', position);

			dispatch({
				type: GET_USER_POS,
				payload: position
			});
		});
	};
};

export const getNearbyRoutes = (userPos) => {
	return (dispatch) => {
		dispatch(getUserPos())
	}
 
	let sw = {};
	let ne = {};
	sw.lat = userPos[0] + 0.5;
	sw.lng = userPos[1] - 0.5;
	ne.lat = userPos[0] - 0.5;
	ne.lng = userPos[1] + 0.5;

	axios.get(`https://transit.land/api/v1/routes?bbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}`).then((response) => {
		console.log('@getNearbyRoutes response:', response);
	});
}