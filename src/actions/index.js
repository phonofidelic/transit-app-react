import axios from 'axios';
import { 
	REQUEST_ROUTES,
	RECIEVE_ROUTES
} from '../actiontypes';

const _getUserPos = new Promise((resolve) => {
	let position = [];
	navigator.geolocation.getCurrentPosition((pos) => {
		position.push(pos.coords.latitude, pos.coords.longitude);
		console.log('@getUserPos position:', position);
		resolve(position);
	});
});

export const fetchNearbyRoutes = () => {
	console.log('@fetchNearbyRoutes is called');
	return (dispatch) => {
		_getUserPos.then((userPos) => {
			let sw = {};
			let ne = {};
			sw.lat = userPos[0] + 0.5;
			sw.lng = userPos[1] - 0.5;
			ne.lat = userPos[0] - 0.5;
			ne.lng = userPos[1] + 0.5;

			dispatch({
				type: REQUEST_ROUTES
			});

			axios.get(`https://transit.land/api/v1/routes?bbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}&per_page=5`)
				.then((response) => {
					console.log('@fetchNearbyRoutes response:', response);
					// TODO: dispatch with results of request
					dispatch({
						type: RECIEVE_ROUTES,
						payload: response.data.routes
					});
				}).catch((err) => {
					console.error('Transitland fetch error:', err);
					// TODO: add handler
				});
		}).catch((err) => {
			console.error('_getUserPos error:', err);
		});
	}
}