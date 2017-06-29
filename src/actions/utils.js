import axios from 'axios';
import { 
	REQUEST_ROUTES,
	RECIEVE_ROUTES,
	SET_ROUTE_COLORS,
	INIT_MAP,
	MAP_LOADED,
	// SELECT_ROUTE,
	FETCH_ROUTES_ERROR,
	// FETCH_STOPS,
	// FOCUS_ROUTE
} from '../actiontypes';
import { openDb, getStoredRouteData } from '../utils/dbUtils';
const L = window.L;
// const randomColor = require('randomcolor');
const dbPromise = openDb();

const TRANSIT_API_BASE_URL = 'https://transit.land/api/v1/';

export const getUserPos = new Promise((resolve) => {
	let position = {};
	navigator.geolocation.getCurrentPosition((pos) => {
		// position.push(pos.coords.latitude, pos.coords.longitude);
		position.lat = pos.coords.latitude;
		position.lng = pos.coords.longitude;
		console.log('@getUserPos position:', position);
		resolve(position);
	});
});

export const routeColorCheck = (routes, dispatch) => new Promise((resolve) => {

	const STATIC_COLORS = [
	'#00985f',
	'#4e5357',
	'#6e3217',
	'#cf8e00',
	'#ff6319',
	'#006a84',
	'#01af40',
	'#0038a5',
	'#c60c31',
	'#01a1df',
	'#996533',
	'#6bbf43',
	'#a8a9ad',
	'#808183',
	'#fccc0a'
];

	// let randomColors = randomColor({
	// 	count: routes.length,
	// 	luminosity: 'dark'
	// });	

	let randomColors = STATIC_COLORS;

	routes.forEach((route, i) => {
		if (!route.color) {
			route.color = randomColors[i];
			// console.log('### route.color:', route.color, i)
			// randomColors.splice(i, i+1);
		}
	});
	// console.log('@_routeColorCheck, routes:', routes)
	resolve(routes);
});

export const setUpRouteVisuals = (routes) => new Promise((resolve) => {
	let routeLineLayer = L.layerGroup();

	routes.map((route) => {
		let lines = route.geometry.coordinates;
		return lines.forEach((line, i) => {
			let latLngs = [];
			line.forEach((coord) => {
				return latLngs.push(L.latLng(coord[1], coord[0]));
			});
			routeLineLayer.addLayer(L.polyline(latLngs, {color: route.color, weight: 2}));
		});
	});

	resolve(routeLineLayer);
});

export const initMap = (routes, dispatch) => {

	console.log('@_initMap is called');
		let position = [];
		getUserPos.then((userPos) => {
			position.push(userPos.lat, userPos.lng);

			L.Mapzen.apiKey = 'mapzen-bynLHKb';
			let map = L.Mapzen.map('map', { 
				scrollWheelZoom: false,
				scene: L.Mapzen.BasemapStyles.Refill
			});
			
			map.setView(position, 12);

			// Event handler for map scrolling, fetches nearby routes
			// of new map center
			let lastBbox = map.getBounds(); 
			map.on('moveend', (e) => {
				// Get new map center lat/lng
				let mapCenter = map.getCenter();
				let mapBounds = map.getBounds();

				// Check if mapCenter is inside of last bbox
				if (mapCenter.lat <= lastBbox._northEast.lat && 
						mapCenter.lng <= lastBbox._northEast.lng && 
						mapCenter.lat >= lastBbox._southWest.lat &&
						mapCenter.lng >= lastBbox._southWest.lng) {
					return;
				} else {
					// TODO: create updateRoutes function that checks
					// for new routes info ???????????????????????????????????????
					
					findOperatorsInArea(mapBounds).then(operators => {
						console.log('### operators:', operators)
						fetchNearbyRoutes(mapCenter, dispatch, operators)
						.then((routes) => {
							routeColorCheck(routes)
							.then((routes) => {
								dispatch({
									type: SET_ROUTE_COLORS,
									payload: routes
								});

								// Set new bbox
								lastBbox = map.getBounds();

								return routes;
							}).then((routes) => {
								setUpRouteVisuals(routes)
								.then((routeLineLayer) => {
									map.addLayer(routeLineLayer);
								})
							})
							.catch((err) => {
								console.error('_routeColorCheck error:', err)
							})
						}).catch((err) => {
							console.error('_fetchNearbyRoutes error:' , err)
						});
					}).catch(err => {
						console.error('_findOperatorsInArea error:', err)
					});
					
				}
			})
			
			dispatch({ 
				type: INIT_MAP,
				payload: map
			});
			
			return { map: map, routes: routes };
		})
		.then(({map, routes}) => {
			// console.log('@_initMap \nmap:', map, 'routes:', routes);


			const marker = L.circleMarker(position);
			marker.addTo(map);

			setUpRouteVisuals(routes)
			.then((routeLineLayer) => {
				map.addLayer(routeLineLayer);
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

export const updateNearbyRoutes = (mapCenter, dispatch) => {

}

export const fetchNearbyRoutes = (position, dispatch, operators) => new Promise((resolve) => {
	console.log('@fetchNearbyRoutes is called', position, 'operators:', operators);

	// Set up request data
	const ROUTES_LENGTH = 10
	let sw = {};
	let ne = {};
	sw.lat = position.lat + 0.5;
	sw.lng = position.lng - 0.5;
	ne.lat = position.lat - 0.5;
	ne.lng = position.lng + 0.5;

	dispatch({
		type: REQUEST_ROUTES,
		payload: position
	});

	getStoredRouteData(dbPromise).then(routes => {
		console.log('@getStoredRouteData, routes:', routes, '@getStoredRouteData, operators:', operators);
		// TODO: Check if routes in idb are relevant to map location !!!!!!!!!!!!!!!!!!!!!!!!
		// for route in routes, if route.operated_by_onestop_id is found in operators[i].onestop_id
		
		let operator_ids = [];
		if (operators) {
			operators.map(operator => {
				return operator_ids.push(operator.onestop_id);
			});
		}
		
		const _checkOperatorList = () => {
			if (operator_ids.indexOf(routes[0].operated_by_onestop_id) === -1) {
				console.log('### did not find operator')
				return false;
			} else {
				console.log('### found operator')
				return true;
			}
		};

		// Check if routes were found in cache and if there is a new operator
		// in the operator list
		if (routes.length && _checkOperatorList()) {
			dispatch({
				type: RECIEVE_ROUTES,
				payload: routes
			});

			resolve(routes);
		} else {
			// Fetch routes from network
			let perPage = `per_page=${ROUTES_LENGTH}`;
			axios.get(`${TRANSIT_API_BASE_URL}routes?bbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}&${perPage}`)
			.then((response) => {
				
				let routes = response.data.routes;

				// Create a deselected state for each route
				routes.forEach((route) => route.selected = false);

				dispatch({
					type: RECIEVE_ROUTES,
					recievedAt: Date.now(),
					payload: routes
				});

				console.log('@_fetchNearbyRoutes, routes:', routes)
				resolve(routes);
			})
			.catch((err) => {
				console.error('Transitland fetch error:', err);
				
				dispatch({
					type: FETCH_ROUTES_ERROR,
					payload: 'Sorry, could not retrieve route info at this time. \nPlease try again later.'
				});
			});			
		}
	});
});

export const findOperatorsInArea = (mapBounds) => new Promise(resolve => {
	console.log('@_findOperatorsInArea, mapBounds:', mapBounds);

	axios.get(`${TRANSIT_API_BASE_URL}operators?bbox=${mapBounds._southWest.lng},${mapBounds._southWest.lat},${mapBounds._northEast.lng},${mapBounds._northEast.lat}`)
	.then(response => {
		console.log('_findOperatorsInArea, response:', response);
		resolve(response.data.operators);
	})
	.catch(err => {
		console.error('@_findOperatorsInArea error:', err);
	});
});