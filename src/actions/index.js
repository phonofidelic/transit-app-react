// import axios from 'axios';
import { 
	GET_USER_POS,
	REQUEST_ROUTES,
	RECIEVE_ROUTES,
	SET_ROUTE_COLORS,
	INIT_MAP,
	MAP_LOADED,
	SET_MAP_ROUTES,
	SET_DEST_MARKER,
	SET_TRIP_LINE,
	ZOOM_IN,
	ZOOM_OUT,
	MAP_ERROR,
	SELECT_ROUTE,
	FETCH_ROUTES_ERROR,
	FETCH_STOPS,
	// FOCUS_ROUTE,
	SHOW_TRIP_PLANNER,
	HIDE_TRIP_PLANNER,
	DESTINATION_INPUT_CHANGE,
	// DESTINATION_SEARCH,
	RECEIVE_AUTOCOMPLETE_RESULTS,
	SELECT_DESTINATION,
	RECEIVE_TRIP_DATA,
	SHOW_TRIP_DISPLAY,
 	HIDE_TRIP_DISPLAY } from '../actiontypes';
import * as utils from './utils';

export const init = () => {
	return dispatch => {
		utils.getUserPos.then(userPos => {

			// TODO: to many disptches? Combine into one?
			dispatch({
				type: GET_USER_POS,
				payload: userPos
			});
			dispatch({ type: INIT_MAP });
			dispatch({ type: REQUEST_ROUTES });

			Promise.all([
				utils.initMap(userPos)
				.then(map => {
					map.on('movestart', e => {
						dispatch({
							type: HIDE_TRIP_PLANNER
						});
					});

					dispatch({
						type: MAP_LOADED,
						payload: map
					});

					return map;
				})
				.catch(err => {
					console.error('initMap error:', err);
					dispatch({
						type: MAP_ERROR,
						payload: 'Sorry, the map could not be loaded at this time.'
					});
				}), 
				utils.fetchNearbyRoutes(userPos)
			])
			.then(values => {
				console.log('### promiseAll values:', values)
				const data = {map: values[0], routes: values[1]};
				return data
			})
			// This step updates the ui with color codes as those functions complete
			.then(data => {
				console.log('### data:', data);

				utils.routeColorCheck(data.routes)
				.then(colorCodedRoutes => {
					utils.setUpRouteVisuals(colorCodedRoutes, data.map)
					.then(map => {
						// Set colored routes to map
						dispatch({
							type: SET_MAP_ROUTES,
							payload: map
						});
					})
					.catch(err => {
						console.error('setUpRouteVisuals error:', err);
					});

					// Set route colors to route list
					dispatch({
						type: SET_ROUTE_COLORS,
						payload: colorCodedRoutes
					})
				})
				.catch(err => {
					console.error('routeColorChech error:', err);
				});
			})
		})
		.catch(err => {
			console.error('getUserPos error:', err);
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

export const setDestination = (autocompleteResults, userPos, map, destMarker, tripLayer) => {
	console.log('@setDestination, autocompleteResults:', autocompleteResults);

	const selectedDestination = autocompleteResults[0];

	return dispatch => {
		dispatch({
			type: SELECT_DESTINATION,
			payload: selectedDestination
		});

		utils.focusMapOnDestination(map, selectedDestination.data.geometry.coordinates, destMarker)
		.then(marker => {
				dispatch({
				type: SET_DEST_MARKER,
				payload: marker
			});
		});

		// TODO: move the rest of this to a seperate setTrip function
		utils.mapzenTutnByTurnRequest(userPos, selectedDestination)
		.then(response => {
			dispatch({
				type: RECEIVE_TRIP_DATA,
				payload: response.data.trip.legs[0].maneuvers
			});
			return response.data.trip;
		})
		.then(trip => {

			let endShapeIndexes = [];

			// Find all maneuvers where travel mode is 'transit' and push 
			// that maneuvers end_shape_index to the endShapeIndexes array
			trip.legs[0].maneuvers.forEach(maneuver => {
				if (maneuver.travel_mode === 'transit') {
					console.log('transit maneuver:', maneuver.end_shape_index);
					endShapeIndexes.push(maneuver.end_shape_index);
				}
			});

			return utils.decodePolyline(trip.legs[0].shape)
			.then(latlngs => {
				// Send decoded latlngs and end shape indexes to the next step
				return {latlngs: latlngs, endShapeIndexes: endShapeIndexes};
			})
			.catch(err => {
				console.error('decodePolyline error:', err);
			});
		})
		.then(data => {
			console.log('### data:', data)
			return utils.setTripLineToMap(map, data.latlngs, data.endShapeIndexes, tripLayer);
		})
		.then(tripLayer => {
			dispatch({
				type: SET_TRIP_LINE,
				payload: tripLayer
			});

			dispatch({
				type: SHOW_TRIP_DISPLAY
			});
		})
		.catch(err => {
			console.error('setDestination error:', err);
		});
	}
};

export const hideTripDisplay = () => {
	return dispatch => {
		dispatch({
			type: HIDE_TRIP_DISPLAY
		});
	}
}

export const handleZoomIn = map => {
	console.log('zoom in');
	map.zoomIn();
	return dispatch => {
		{
			type: ZOOM_IN
		}
	} 
}

export const handleZoomOut = map => {
	console.log('zoom out');
	map.zoomOut();
	return dispatch => {
		{
			type: ZOOM_OUT
		}
	} 
}

