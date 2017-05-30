import axios from 'axios';
// import store from '../index';
import { 
	REQUEST_ROUTES,
	RECIEVE_ROUTES,
	SET_ROUTE_COLORS,
	INIT_MAP,
	MAP_LOADED
} from '../actiontypes';
const L = window.L;
const randomColor = require('randomcolor');

const STATIC_COLORS = [
	'00985f',
	'4e5357',
	'6e3217',
	'cf8e00',
	'ff6319',
	'006a84',
	'01af40',
	'0038a5',
	'c60c31',
	'c60c31',
	'01a1df',
	'996533',
	'6bbf43',
	'a8a9ad',
	'808183',
	'fccc0a'
];

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

const _routeColorCheck = (routes) => {
	routes.forEach((route) => {
		if (!route.color) {

		}
	});
}

const _setUpRouteVisuals = (routes, dispatch) => new Promise((resolve) => {
	let routeLineLayer = L.layerGroup();
	let randomColors = randomColor({
		count: routes.length,
		// luminosity: 'light'
		// hue: 'red'
	});
	// console.log('##randomColor:', randomColors, routes.length)

	// console.log('@_setUpRouteVisuals routes:', routes)
	routes.map((route) => {
		let lines = route.geometry.coordinates;

		lines.forEach((line, i) => {
			let latLngs = [];
			line.forEach((coord) => {
				latLngs.push(L.latLng(coord[1], coord[0]));
			});

			// Check that the route has a color prop
			if (route.color) {
				routeLineLayer.addLayer(L.polyline(latLngs, {color: route.color}));
			} else {
				route.color = randomColors[i];
				routeLineLayer.addLayer(L.polyline(latLngs, {color: route.color}));	
				// routeLineLayer.addLayer(L.polyline(latLngs, {color: randomColors[i]}));	
				randomColors.splice(i, i+1);
			}

		});
		// console.log('@_setUpRouteVisuals lines:', lines)
	});
	// console.log('@_setUpRouteVisuals routeLineLayer:', routeLineLayer)
	console.log('@_setUpRouteVisuals, routes:', routes);

	dispatch({
		type: SET_ROUTE_COLORS,
		payload: routes
	});

	resolve(routeLineLayer);
});

// Prevent leaflet map from being created twice
let a = 0;
const _initMap = (routes, dispatch) => {

	console.log('@_initMap is called', a+=1);
	if (a > 1) {
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
			console.log('@_initMap \nmap:', map, 'routes:', routes);


			const marker = L.circleMarker(position);
			marker.addTo(map);

			_setUpRouteVisuals(routes, dispatch)
			.then((routeLineLayer) => {
				map.addLayer(routeLineLayer);
				// routeLineLayer.addTo(map);
				console.log('@_initMap _setUpRouteVisuals, routeLineLayer:', routeLineLayer)
			})

			dispatch({
				type: MAP_LOADED
			});
		})
		.catch((err) => {
			console.error('_initMap error:', err);
			// TODO: add handler
		});
	}
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

			dispatch({
				type: REQUEST_ROUTES
			});

			let perPage = 'per_page=5';
			axios.get(`https://transit.land/api/v1/routes?bbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}&${perPage}`)
				.then((response) => {
					console.log('@fetchNearbyRoutes response:', response);


					return response.data.routes
				})
				// init map here? !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				.then((routes) => {
					_initMap(routes, dispatch);

					console.log('##routes:', routes)
					dispatch({
						type: RECIEVE_ROUTES,
						recievedAt: Date.now(),
						payload: routes
					});
				})
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
