import axios from 'axios';
import { 
	GET_USER_POS,
	// REQUEST_ROUTES,
	// RECIEVE_ROUTES,
	SET_ROUTE_COLORS,
	// INIT_MAP,
	// MAP_LOADED,
	SELECT_ROUTE,
	FETCH_ROUTES_ERROR,
	FETCH_STOPS,
	// FOCUS_ROUTE,
	SHOW_TRIP_PLANNER,
	DESTINATION_INPUT_CHANGE,
	DESTINATION_SEARCH,
	RECEIVE_AUTOCOMPLETE_RESULTS
} from '../actiontypes';
import * as utils from './utils';
import { openDb, populateDb } from '../utils/dbUtils';

// const L = window.L;
// const randomColor = require('randomcolor');
const dbPromise = openDb();

export const init = () => {
	console.log('@init is called');
	// openDb();
	return (dispatch) => {
		utils.getUserPos.then((userPos) => {

		dispatch({
			type: GET_USER_POS,
			payload: userPos
		});

		utils.fetchNearbyRoutes(userPos, dispatch)
			.then((routes) => {
				utils.routeColorCheck(routes).then((routes) => {

					dispatch({
						type: SET_ROUTE_COLORS,
						payload: routes
					});

					return routes
				})
				.then((routes) => {
					utils.initMap(routes, dispatch);

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

export const openTripPlanner = () => {
	console.log('@openTripPlanner called')
	return dispatch => {
		dispatch({
			type: SHOW_TRIP_PLANNER
		});
	}
};

export const handleDestInputChange = (input, userPos) => {
	return dispatch => {
		if (input.length) {

			utils.fetchMapzenAutocomplete(input, userPos)
			.then(autocompleteResults => {
				console.log('@handleDestInputChange, autocompleteResults:', autocompleteResults)
				dispatch({
					type: RECEIVE_AUTOCOMPLETE_RESULTS,
					payload: autocompleteResults
				});
			});
		
			dispatch({
				type: DESTINATION_INPUT_CHANGE,
				payload: input
			});
		}
	}
};

export const setDestination = (autocompleteResults, userPos, map) => {
	console.log('@setDestination, autocompleteResults:', autocompleteResults);

	const selectedLocation = autocompleteResults[0];

	return dispatch => {
		dispatch({
			type: DESTINATION_SEARCH
		});

		utils.focusMapOnDestination(map, selectedLocation.data.geometry.coordinates)
	}
};

