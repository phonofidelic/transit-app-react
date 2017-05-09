import axios from 'axios';
import { 
	GET_USER_POS, 
	UPDATE_MAP_VIEW,
	GET_NEARBY_ROUTES
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

			axios.get(`https://transit.land/api/v1/routes?bbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}`)
				.then((response) => {
					console.log('@fetchNearbyRoutes response:', response);
					// TODO: dispatch with results of request
					dispatch({
						type: GET_NEARBY_ROUTES,
						payload: response.data.routes
					});
				});
		})
	}
}