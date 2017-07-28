// import axios from 'axios';
import { 
	GET_USER_POS,
	REQUEST_ROUTES,
	RECIEVE_ROUTES,
	SET_ROUTE_COLORS,
	INIT_MAP,
	MAP_LOADED,
	UPDATE_MAP_VIEW,
	SET_MAP_ROUTES,
	SET_DEST_MARKER,
	SET_TRIP_LINE,
	TOGGLE_ROUTE_LINE_VIEW,
	ZOOM_IN,
	ZOOM_OUT,
	CENTER_ON_USER_POS,
	CENTER_ON_COORDS,
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
 	HIDE_TRIP_DISPLAY,
 	SELECT_MANEUVER } from '../actiontypes';
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
					// map.on('movestart', e => {
					// 	dispatch({
					// 		type: HIDE_TRIP_PLANNER
					// 	});
					// });

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
					.then(data => {
						// Set colored routes to map
						dispatch({
							type: SET_MAP_ROUTES,
							map: data.map,
							routeLineLayer: data.routeLineLayer
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

export const setDestination = (tripPlannerProps) => {
	console.log('@setDestination, autocompleteResults:', tripPlannerProps.autocompleteResults);

	const selectedDestination = tripPlannerProps.autocompleteResults[0];

	return dispatch => {
		dispatch({
			type: SELECT_DESTINATION,
			payload: selectedDestination
		});

		utils.focusMapOnDestination(tripPlannerProps.map, selectedDestination.data.geometry.coordinates, tripPlannerProps.destMarker)
		.then(marker => {
				dispatch({
				type: SET_DEST_MARKER,
				destMarker: marker,
				map: tripPlannerProps.map
			});
		});

		// TODO: move the rest of this to a seperate setTrip function
		utils.mapzenTutnByTurnRequest(tripPlannerProps.userPos, selectedDestination)
		.then(response => {
			let maneuvers = response.data.trip.legs[0].maneuvers;

			maneuvers.forEach((maneuver, i) => {
				maneuver.isSelected = false;
				maneuver.index = i;
				maneuver.id = Math.ceil(Math.random()*100000);
			});

			// dispatch({
			// 	type: RECEIVE_TRIP_DATA,
			// 	payload: maneuvers
			// });
			return response.data.trip;
		})
		.then(trip => {

			let endShapeIndexes = [],
					beginShapeIndexes = [];

			// Find all maneuvers where travel mode is 'transit' and push 
			// that maneuvers end_shape_index to the endShapeIndexes array
			trip.legs[0].maneuvers.forEach(maneuver => {
				if (maneuver.travel_mode === 'transit') {
					endShapeIndexes.push(maneuver.end_shape_index);
				} else if (maneuver.travel_mode === 'pedestrian') {
					beginShapeIndexes.push(maneuver.begin_shape_index);
				}
			});

			// !!! EXPERIMENTAL !!!
			// Pass all end_shape_indexes to dat obj
			// let allEndShapeIndexes = [];
			// trip.legs[0].maneuvers.forEach(maneuuver => {
			// 	allEndShapeIndexes.push(maneuver.end_shape_index);
			// });

			return utils.decodePolyline(trip.legs[0].shape)
			.then(latlngs => {
				// Send decoded latlngs and end shape indexes to the next step
				return {
					latlngs: latlngs, 
					endShapeIndexes: endShapeIndexes,
					beginShapeIndexes: beginShapeIndexes,
					// allEndShapeIndexes: allEndShapeIndexes,
					maneuvers: trip.legs[0].maneuvers
				};
			})
			.catch(err => {
				console.error('decodePolyline error:', err);
			});
		})
		.then(data => {
			console.log('### data:', data)

			utils.mapCoordsToManeuvers(data.maneuvers, data.latlngs)
			.then(maneuvers => {
				
				
				// If maneuver is of type transit, add transit color prop.
				maneuvers.forEach(maneuver => {
					if (maneuver.transit_info) {
						maneuver.transitColor = `#${maneuver.transit_info.color.toString(16)}`;
					}
				});

				// Calculate estimated elapsed time from trip start to maneuver
				for (var i = 0; i < maneuvers.length; i++) {
					let time = 0;
					for (var j = 0; j < i; j++) {
						time += maneuvers[j].time;
					}

					// Multiply by 1000 to convert value from seconds to miliseconds
					maneuvers[i].arrivalTime = time * 1000;
				};

				console.log('### mapCoordsToManeuvers, maneuvers:', maneuvers)

				dispatch({
					type: RECEIVE_TRIP_DATA,
					payload: maneuvers
				});
			})
			.catch(err => {
				console.error('mapCoordsToManeuvers error:', err);
			});

			return utils.setTripLineToMap(tripPlannerProps.map, data, tripPlannerProps.tripLineLayer, tripPlannerProps.routeLineLayer);
		})
		.then(tripLineLayer => {
			dispatch({
				type: SET_TRIP_LINE,
				payload: tripLineLayer
			});

			dispatch({
				type: SHOW_TRIP_PLANNER
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
			type: HIDE_TRIP_PLANNER
		});
	}
}

export const showTripDisplay = () => {
	return dispatch => {
		dispatch({
			type: SHOW_TRIP_DISPLAY
		});
	}
}

export const toggleRouteLineView = (map, layerToRemove, layerToAdd) => {
	
	if (layerToRemove) {
		map.removeLayer(layerToRemove);
	}

	if (layerToAdd) {
		map.addLayer(layerToAdd);	
	}

	return dispatch => {
		dispatch({
			type: TOGGLE_ROUTE_LINE_VIEW,
			map: map,
		});
	}
}

export const selectManeuver = index => {
	console.log('@selectManeuver, id:', index)
	return dispatch => {
		dispatch({
			type: SELECT_MANEUVER,
			payload: index
		});
	}
}

export const handleFocusOnLoc = (map, userPos) => {
	map.setView(userPos);
	return dispatch => {
		dispatch({
			type: CENTER_ON_USER_POS,
			payload: map
		});
	}
}

export const handleZoomIn = map => {
	console.log('zoom in');
	map.zoomIn();
	return dispatch => {
		dispatch({
			type: ZOOM_IN,
			payload: map
		});
	} 
}

export const handleZoomOut = map => {
	console.log('zoom out');
	map.zoomOut();
	return dispatch => {
		dispatch({
			type: ZOOM_OUT,
			payload: map
		});
	} 
}

export const centerOnCoords = (map, coords, oldMarker) => {
	return dispatch => {
		utils.setFocusMarker(map, coords, oldMarker)
		.then(data => {
			data.map.setView({lat: coords[0], lng: coords[1]});
			dispatch({
				type: CENTER_ON_COORDS,
				map: data.map,
				focusMarker: data.focusMarker
			});
		})
		.catch(err => {
			console.error('setFocusMarker error:', err);
		});
	}
}

