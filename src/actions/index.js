import axios from 'axios';
// import store from '../index';
import { 
	REQUEST_ROUTES,
	RECIEVE_ROUTES,
	INIT_MAP,
	MAP_LOADED
} from '../actiontypes';
const L = window.L;


// store.subscribe(() => {
// 	let state = this.getState()
// 	console.log('##state:', state)
// })
// console.log('## store:', store)

const _getUserPos = new Promise((resolve) => {
	let position = [];
	navigator.geolocation.getCurrentPosition((pos) => {
		position.push(pos.coords.latitude, pos.coords.longitude);
		console.log('@getUserPos position:', position);
		resolve(position);
	});
});

const _setUpRouteVisuals = (routes) => new Promise((resolve) => {
	let routeLineLayer = L.layerGroup();
	console.log('@_setUpRouteVisuals routes:', routes)
	routes.routes.map((route) => {
		let lines = route.geometry.coordinates;

		lines.forEach((line) => {
			let latLngs = [];
			line.forEach((coord) => {
				latLngs.push(L.latLng(coord[1], coord[0]));
			});
			routeLineLayer.addLayer(L.polyline(latLngs, {color: 'green'}));
		});
		// console.log('@_setUpRouteVisuals lines:', lines)
	});
	console.log('@_setUpRouteVisuals routeLineLayer:', routeLineLayer)
	resolve(routeLineLayer);
});

export const initMap = (routes, dispatch) => {
	console.log('@initMap is called');
	// return () => {
		let position = [];
		_getUserPos.then((userPos) => {
			position.push(userPos[0], userPos[1]);

			L.Mapzen.apiKey = 'mapzen-bynLHKb';
			let map = L.Mapzen.map('map', { 
				scrollWheelZoom: false,
				scene: L.Mapzen.BasemapStyles.Refill
			});
			
			map.setView(position, 12);
			
			dispatch({ 
				type: INIT_MAP,
				payload: map
			});
			return { map: map, routes: routes };
		})
		.then(({map, routes}) => {
			console.log('@initMap \nmap:', map, 'routes:', routes);


			const marker = L.circleMarker(position);
			marker.addTo(map);

			_setUpRouteVisuals(routes)
			.then((routeLineLayer) => {
				map.addLayer(routeLineLayer);
				// routeLineLayer.addTo(map);
				console.log('@initMap _setUpRouteVisuals, routeLineLayer:', routeLineLayer)
			})

			dispatch({
				type: MAP_LOADED
			});
		})
		.catch((err) => {
			console.error('initMap error:', err);
			// TODO: add handler
		});
	// }
}

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

			// console.log('#bbox:', sw, ne)

			dispatch({
				type: REQUEST_ROUTES
			});

			axios.get(`https://transit.land/api/v1/routes?bbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}&per_page=5`)
				.then((response) => {
					console.log('@fetchNearbyRoutes response:', response);
					dispatch({
						type: RECIEVE_ROUTES,
						recievedAt: Date.now(),
						payload: response.data.routes
					});
					return {
						routes: response.data.routes
					}
				})
				// init map here? !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				.then((routes) => {
					console.log('## before initMap, \nroutes:', routes, 'userPos:', userPos); 
					// let map;
					// if (map === undefined) {
					// 	L.Mapzen.apiKey = 'mapzen-bynLHKb';
					// 	map = L.Mapzen.map('map', { scrollWheelZoom: false });
					// 	const marker = L.circleMarker(userPos);
					// 	marker.addTo(map);
					// 	map.setView(userPos, 16)
					// }

					// _setUpRouteVisuals(routes)
					// .then((routeLineLayer) => {
					// 	map.addLayer(routeLineLayer)
					// })

					// dispatch({
					// 	type: INIT_MAP,
					// 	payload: map
					// });
					initMap(routes, dispatch);
				})
				// .then((routes) => {
				// let position = [];
				// 	_getUserPos.then((userPos) => {
				// 		position.push(userPos[0], userPos[1]);

				// 		L.Mapzen.apiKey = 'mapzen-bynLHKb';
				// 		let map = L.Mapzen.map('map', { scrollWheelZoom: false });
				// 		const marker = L.circleMarker(position);
				// 		marker.addTo(map);
				// 		map.setView(position, 16);
						
				// 		dispatch({ 
				// 			type: INIT_MAP,
				// 			payload: map
				// 		});
				// 		console.log('### map:', map)
				// 		return map;
				// 	})

				// 	.then((map) => {
				// 		console.log('@initMap map:', map);
				// 		console.log('@initMap routes:', routes);

				// 		_setUpRouteVisuals(routes).then((routeLineLayer) => {
				// 			map.addLayer(routeLineLayer);
				// 		})
				// 		.catch((err) => {
				// 			console.error('setUpRouteVisuals error', err);
				// 		});

				// 		// let routeLineLayer = L.layerGroup();
				// 		// routes.map((route) => {
				// 		// 	let lines = route.geometry.coordinates;
				// 		// 	lines.forEach((line) => {
				// 		// 		let latLngs = [];
				// 		// 		line.forEach((coord) => {
				// 		// 			latLngs.push(L.latLng(coord[1], coord[2]));
				// 		// 		});
				// 		// 		routeLineLayer.addLayer(L.polyline(latLngs, { color: '#ff0000'}));
				// 		// 	})
				// 		// })

				// 		dispatch({
				// 			type: MAP_LOADED
				// 		});
				// 	})					
				// })
				.catch((err) => {
					console.error('Transitland fetch error:', err);
					// TODO: add handler
				});
		})
		.catch((err) => {
			console.error('_getUserPos error:', err);
		});
	}
}



export const updateMap = (map, routes) => {
	console.log('@updateMap map, routes:', map, routes);
}

export const renderRouteLines = () => {

}
