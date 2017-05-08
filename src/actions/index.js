import axios from 'axios';
import { 
	GET_USER_POS, 
	UPDATE_MAP_VIEW 
} from '../actiontypes';
const L = window.L;
// const L = require('leaflet/dist/leaflet');
// require('leaflet.locatecontrol');

export const getUserPos = () => {

	// const getCurrentPositionpPromise =  new Promise((res, rej) => {
	// 		navigator.geolocation.getCurrentPosition((pos) => {
	// 			console.log('pos:', pos)
	// 			res(pos)
	// 		});
	// })
	
	// return (dispatch) => {
	// 	console.log('test')
	// 	getCurrentPositionpPromise.then((position) => {
	// 		console.log('position:', position);
	// 		dispatch({
	// 			type: GET_USER_POS,
	// 			payload: position
	// 		})
	// 	})
	// };

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

export const updateMapView = (map) => {
	let position = [];
	return (dispatch) => {
		navigator.geolocation.getCurrentPosition((pos) => {
			
			position.push(pos.coords.latitude, pos.coords.longitude);

			const marker = L.circleMarker(position);
			marker.addTo(map);
			map.setView(position, 16);


			// dispatch({
			// 	type: GET_USER_POS
			// })
		})
	}
}

