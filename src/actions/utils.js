import axios from 'axios';
import _ from 'lodash';
import { openDb } from '../utils/dbUtils';
import * as dbUtils from '../utils/dbUtils';

const L = window.L;
// const L = require('leaflet');
// const randomColor = require('randomcolor');
const dbPromise = openDb();

const TRANSIT_API_BASE_URL = 'https://transit.land/api/v1/';
const MAPZEN_SEARCH_API_KEY = 'search-3LVgAzp' // TODO: move to environment varialble
const MAPZEN_TURNBYTURN_API_KEY = 'valhalla-m9bds2x';	// TODO: move to environment varialble
const ROUTES_RETURN_LENGTH = 10;

// Error handler to check values returned in .then chains
const handleError = (value, valueName) => {
	if (!value) {
		throw new Error(`${valueName} is ${value}.`);
	}
};

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

// TODO: disable when in user is in plan trip mode? ###################### TODO
const handleMapScroll = map => {
	let mapCenter = map.getCenter();
	let mapBounds = map.getBounds();

	// Check if mapCenter is inside of last bbox
	if (mapCenter.lat <= map.lastBbox._northEast.lat && 
					mapCenter.lng <= map.lastBbox._northEast.lng && 
					mapCenter.lat >= map.lastBbox._southWest.lat &&
					mapCenter.lng >= map.lastBbox._southWest.lng) {
				return;
	} else {
		findOperatorsInArea(mapBounds)
		.then(operators => {
			handleError(operators, 'operators');
			return fetchNearbyRoutes(mapCenter, operators);
		})
		.then(routes => {
			handleError(routes, 'routes');

			// Set new bbox after new routes are returned
			map.lastBbox = map.getBounds();

			return routeColorCheck(routes);
		})
		.then(colorCodedRoutes => {
			handleError(colorCodedRoutes, 'colorCodedRoutes');
			return setUpRouteVisuals(colorCodedRoutes, map);
		})
		.catch(err => {
			console.error('findOperatorsInArea error:', err);
		});
	}
};

export const routeColorCheck = routes => new Promise(resolve => {
	// An array of static colors
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

	// Coppy of the static colors array
	let randomColors = STATIC_COLORS;

	routes.forEach((route, i) => {
		if (!route.color) {
			route.color = randomColors[i];
		}
	});

	resolve(routes);
});

export const setUpRouteVisuals = (routes, map) => new Promise((resolve) => {
	let routeLineLayer = L.layerGroup();

	routes.map((route) => {
		let lines = route.geometry.coordinates;
		return lines.forEach((line, i) => {
			let latLngs = [];
			line.forEach((coord) => {
				return latLngs.push(L.latLng(coord[1], coord[0]));
			});
			const routeLine = L.polyline(latLngs, {color: route.color, weight: 2});
			routeLineLayer.addLayer(routeLine);
		});
	});

	map.addLayer(routeLineLayer);
	resolve({ map: map, routeLineLayer: routeLineLayer});
});

export const initMap = userPos => new Promise(resolve => {

	const mapCenter = [userPos.lat, userPos.lng];

	L.Mapzen.apiKey = 'mapzen-bynLHKb';
	let map = L.Mapzen.map('map', {
		scrollWheelZoom: false,
		tangramOptions: {scene: L.Mapzen.BasemapStyles.Refill},
		zoomControl: false
	});

	L.circleMarker(mapCenter).addTo(map);	// TODO: refactor to dynamically render on user position changes

	// TODO: move this out of the map initialization
	// routeLineLayer.addTo(map);

	map.setView(mapCenter, 12);

	map.lastBbox = map.getBounds();

	// Add event listeners
	map.on('movestart', e => {
		// Dispatch HIDE_TRIP_PLANNER
	});

	map.on('moveend', e => {
		handleMapScroll(map);
	});

	resolve(map);

});

export const fetchNearbyOperators = (userPos) => new Promise((resolve) => {
	axios.get(`${TRANSIT_API_BASE_URL}operators?lon=${userPos.lng}&lat=${userPos.lat}&r=5000`)
	.then(response => {
		
		resolve(response.data.operators);
	})
	.catch(err => {
		console.error('fetchNearbyOperators error:', err);
	});
});

export const fetchNearbyRoutes = (userPos, operators) => new Promise(resolve => {
	// Helper function for when fetchNearbyRoutes is called 
	// to update routes data. _checkOperatorList creates an 
	// array of operator ids and checks the first route item 
	// for a matching operator id. If one is found, the map is
	// focused on the same area and there is no need to fetch 
	// new routes data. 
	const _checkOperatorList = (routes) => {
		let operator_ids = [];
		if (operators) {
			operators.map(operator => {
				return operator_ids.push(operator.onestop_id);
			});
		}
		
		if (operator_ids.indexOf(routes[0].operated_by_onestop_id) === -1) {
			console.log('### did not find operator')
			return false;
		} else {
			console.log('### found operator')
			return true;
		}
	};

	// Set up bbox for Transitland routes request
	let box = {
		ne: {
			lat: userPos.lat - 0.5,
			lng: userPos.lng + 0.5
		},
		sw: {
			lat: userPos.lat + 0.5,
			lng: userPos.lng - 0.5
		}
	};

	// Check idb for stored route data before making a request to network
	dbUtils.getStoredRouteData(dbPromise).then(routes => {
		// If routes are returned from getStoredRouteData and there
		// is no need to fetch new routes data, resolve with routes
		// data that is stored in idb.
		if (routes.length && _checkOperatorList(routes)) {
			resolve(routes);
		} else {
			// Fetch routes form network and store them in idb
			axios.get(`${TRANSIT_API_BASE_URL}routes?bbox=${box.sw.lng},${box.sw.lat},${box.ne.lng},${box.ne.lat}&per_page=${ROUTES_RETURN_LENGTH}`)
			.then(response => {
				let routes = response.data.routes;

				// Create a deselected state for each route
				routes.forEach(route => {
					route.selected = false;
				});

				resolve(routes);
			})
			.catch(err => {
				new Error('Sorry, could not retrieve route info at this time. \nPlease try again later.');
			});
		}
	})
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

export const fetchMapzenAutocomplete = (input, userPos) => new Promise(_.throttle((resolve) => {
	const mapzenAutocompleteReq = `https://search.mapzen.com/v1/autocomplete?api_key=${MAPZEN_SEARCH_API_KEY}&sources=openaddresses&text=${input}&focus.point.lat=${userPos.lat}&focus.point.lon=${userPos.lng}`;
	axios.get(mapzenAutocompleteReq).then(response => {
		console.log(response)

		let data = [];
		response.data.features.map(item => {
			data.push({label: item.properties.label, data: item});
		});
		resolve(data);
	});
}), 500);

export const focusMapOnDestination = (map, destCoords, destMarker) => new Promise(resolve => {
	// If a destination marker exists, remove it from the map before adding the new one
	if (destMarker) {
		map.removeLayer(destMarker);
	}
	const latlng = L.latLng(destCoords[1], destCoords[0]);
	const marker = L.marker(latlng).addTo(map);
	map.setView(latlng, 16);

	resolve(marker);
});

export const mapzenTutnByTurnRequest = (userPos, selectedDestination) => new Promise(resolve => {
	const locations = [
		{lat: userPos.lat, lon: userPos.lng},
		{
			lat: selectedDestination.data.geometry.coordinates[1], 
			lon: selectedDestination.data.geometry.coordinates[0],
			street: selectedDestination.data.properties.street
		}
	];

	const costing = 'multimodal';
	const costing_options = {};

	const requestParams = JSON.stringify({
		locations: locations,
		costing:costing
	}, null);

	const request = `https://valhalla.mapzen.com/route?json=${requestParams}&api_key=${MAPZEN_TURNBYTURN_API_KEY}`;
	console.log('### request:', request)

	axios.get(request).then(response => {
		console.log('@mapzenTutnByTurnRequest, response:', response)
		resolve(response);
	})
	.catch(err => {
		console.error('mapzenTutnByTurnRequest error:', err);
	});
});

export const decodePolyline = (str, precision) => new Promise(resolve => {
		const factor = Math.pow(10, precision || 6);
    let index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change;
        

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }
    resolve(coordinates);
});

export const setTripLineToMap = (map, data, oldTripLineLayer, routeLineLayer) => new Promise(resolve => {
	map.removeLayer(routeLineLayer);

	if (oldTripLineLayer) {		
		map.removeLayer(oldTripLineLayer);
	}

	let newTripLines = [];
	let latlngIndex = 0;
	let i = 0;
	while (latlngIndex < data.latlngs.length) {
		newTripLines.push(data.latlngs.slice(latlngIndex, data.endShapeIndexes[i]));
		latlngIndex = data.endShapeIndexes[i];
		i+=1;
	}

	console.log('### newTripLines:', newTripLines);

	let tripLineLayer = L.layerGroup();

	const testColors = [		
		'#00985f',
		'#4e5357',
		'#6e3217',
		'#cf8e00',
		'#ff6319',
		'#006a84',
		'#01af40',
	];

	const pedestrianColor = '#82df5a';

	newTripLines.forEach((line, i) => {
	 	tripLineLayer.addLayer(L.polyline(line, {color: testColors[i]}));
	});

	tripLineLayer.addTo(map);

	resolve(tripLineLayer);

	// const line = L.polyline(latlngs, {color: 'red', weight: 4, dashArray: [5, 10]}).addTo(map);
	// resolve(line);
});

export const mapCoordsToManeuvers = (maneuvers, coords) => new Promise(resolve => {
	maneuvers.forEach(maneuver => {
		// !!! BUG: maneuver coords are not acurate for transit stops ----------------------------------!!!!!!!!!!!!!!!!!!!!!!!!
		maneuver.coords = coords[maneuver.begin_shape_index];
	});

	resolve(maneuvers)
});

export const setFocusMarker = (map, coords, oldMarker) => new Promise(resolve => {
	if (oldMarker) {
		map.removeLayer(oldMarker);
	}

	const latlng = L.latLng(coords[0], coords[1]);
	const focusMarker = L.circle(latlng, {stroke: true, fillColor: '#fff', fillOpacity: 1.0});
	map.addLayer(focusMarker);

	resolve({map: map, focusMarker: focusMarker});
});

