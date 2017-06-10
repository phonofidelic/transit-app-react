import axios from 'axios';
import { 
	REQUEST_ROUTES,
	RECIEVE_ROUTES,
	SET_ROUTE_COLORS,
	INIT_MAP,
	MAP_LOADED,
	SELECT_ROUTE,
	FETCH_ROUTES_ERROR,
	FETCH_STOPS,
	FOCUS_ROUTE
} from '../actiontypes';
import { openDb, populateDb } from '../utils/dbUtils';
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

const _getUserPos = new Promise((resolve) => {
	let position = {};
	navigator.geolocation.getCurrentPosition((pos) => {
		// position.push(pos.coords.latitude, pos.coords.longitude);
		position.lat = pos.coords.latitude;
		position.lng = pos.coords.longitude;
		console.log('@getUserPos position:', position);
		resolve(position);
	});
});

const dbPromise = openDb();

const _routeColorCheck = (routes, dispatch) => new Promise((resolve) => {
	let randomColors = randomColor({
		count: routes.length,
		luminosity: 'dark'
	});	

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

const _setUpRouteVisuals = (routes) => new Promise((resolve) => {
	let routeLineLayer = L.layerGroup();

	routes.map((route) => {
		let lines = route.geometry.coordinates;
		lines.forEach((line, i) => {
			let latLngs = [];
			line.forEach((coord) => {
				latLngs.push(L.latLng(coord[1], coord[0]));
			});
			routeLineLayer.addLayer(L.polyline(latLngs, {color: route.color}));
		});
	});

	resolve(routeLineLayer);
});

const _initMap = (routes, dispatch) => {

	console.log('@_initMap is called');
		let position = [];
		_getUserPos.then((userPos) => {
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
			console.log('### lastBbox:', lastBbox)
			map.on('moveend', (e) => {
				// Get new map center lat/lng
				const mapCenter = map.getCenter();
				console.log('### mapCenter:', mapCenter);

				// Check if mapCenter is inside of last bbox
				if (mapCenter.lat <= lastBbox._northEast.lat && 
						mapCenter.lng <= lastBbox._northEast.lng && 
						mapCenter.lat >= lastBbox._southWest.lat &&
						mapCenter.lng >= lastBbox._southWest.lng) {
					return;
				} else {
					// TODO: create updateRoutes function that checks
					// for new routes info
						
					_fetchNearbyRoutes(mapCenter, dispatch)
					.then((routes) => {
						_routeColorCheck(routes)
						.then((routes) => {
							dispatch({
								type: SET_ROUTE_COLORS,
								payload: routes
							});

							// Set new bbox
							lastBbox = map.getBounds();

							return routes;
						}).then((routes) => {
							_setUpRouteVisuals(routes)
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

			_setUpRouteVisuals(routes)
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

const _updateNearbyRoutes = (mapCenter, dispatch) => {

}

const _fetchNearbyRoutes = (position, dispatch, lastPos) => new Promise((resolve) => {
	console.log('@fetchNearbyRoutes is called', position);

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

	let perPage = 'per_page=10';
	axios.get(`https://transit.land/api/v1/routes?bbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}&${perPage}`)
		.then((response) => {
			// console.log('@fetchNearbyRoutes response:', response);					
			
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
});

export const init = () => {
	console.log('@init is called');
	// openDb();
	return (dispatch) => {
		_getUserPos.then((userPos) => {
		_fetchNearbyRoutes(userPos, dispatch)
			.then((routes) => {
				_routeColorCheck(routes).then((routes) => {

					dispatch({
						type: SET_ROUTE_COLORS,
						payload: routes
					});

					return routes
				})
				.then((routes) => {
					_initMap(routes, dispatch);

					// Save routes data to idb
					populateDb(dbPromise, routes);
				})
				.catch((err) => {
					console.log('_routeColorCheck error:', err);
					// TODO: add error handler
				})
			})			
			.catch((err) => {
				console.error('Transitland fetch error:', err);
				
				dispatch({
					type: FETCH_ROUTES_ERROR,
					payload: 'Sorry, could not retrieve route info at this time. \nPlease try again later.'
				});
			});
		})
		.catch((err) => {
			console.error('_getUserPos error:', err);
		});
	}
}

export const selectRoute = (routes, id) => {
	console.log('@selectRoute:', id, routes);
	const newRoutes = routes.map((route) => {

		if (route.onestop_id === id) {
			console.log('### route:', route.selected)
			route.selected = !route.selected;
		} else {
			route.selected = false;			
		}
		return route;
	});
	// console.log('### newRoutes:', newRoutes)
	return (dispatch) => {
		dispatch({
			type: SELECT_ROUTE,
			payload: newRoutes
		});
	}
}

export const fetchStops = (route) => {
	const stops = route.stops_served_by_route.slice(0,9)

	console.log('@fetchStops, stops:', stops)
	return (dispatch) => {
		dispatch({
			type: FETCH_STOPS,
			payload: stops
		});
	}
}

export const updateMap = (map, routes) => {
	console.log('@updateMap map, routes:', map, routes);
}

export const renderRouteLines = () => {

}
