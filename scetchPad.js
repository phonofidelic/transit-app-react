const updateRoutes = (map, mapBounds, mapCenter, dispatch) => {
	findOperatorsInArea(mapBounds)
	.then(operators => {
		handleError(operators, 'operators');
		return fetchNearbyRoutes(mapCenter, dispatch, operators);
	})
	.then(routes => {
		handleError(routes, 'routes');
		return routeColorCheck(routes);
	})
	.then(routes => {
		handleError(routes, 'routes');

		dispatch({
			type: SET_ROUTE_COLORS,
			payload: routes
		});

		// Set new bbox
		lastBbox = map.getBounds();

		return routes;
	})
	.then(routes => {
		handleError(routes, 'routes');
		return setUpRouteVisuals(routes);
	})
	.then(routeLineLayer => {
		handleError(routeLineLayer, 'routeLineLayer');
		map.addLayer(routeLineLayer);
	})
	.catch(err => {
		console.error('findOperatorsInArea error:', err);
	});
}

export const init = () => {
	return dispatch => {
		utils.getUserPos.then(userPos => {
			dispatch({
				type: GET_USER_POS,
				payload: userPos
			});

			return userPos;
		})
		.then(userPos => {
			let data = {};

			// Init map
			dispatch({
				type: INIT_MAP
			});

			data.map = utils.initMap(userPos)
			.then(map => {
				// Add map event handler
				map.on('movestart', e => {
					dispatch({
						type: HIDE_TRIP_PLANNER
					});
				})
				return map;
			})
			.catch(err => {
				console.error('initMap error:', err);

				dispatch({
					type: MAP_ERROR,
					payload: 'Sorry, the map could not be loaded at this time.'
				});
			});

			// Fetch routes
			dispatch({
				type: REQUEST_ROUTES
			});

			data.routes = utils.fetchNearbyRoutes(userPos)
			.then(routes => {
				dispatch({
					type: RECIEVE_ROUTES,
					payload: routes
				});
				return routes;
			})
			.catch(err => {
				console.error('fetchNearbyRoutes error:', err);

				dispatch({
					type: FETCH_ROUTES_ERROR,
					payload: err.message
				});
			});

			return data;
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
		.catch(err => {
			console.error('init error:', err);
		});
	}
}


Promise.all([
	utils.initMap(userPos)
	.then(map => {
		map.on('movestart', e => {
			dispatch({
				type: HIDE_TRIP_PLANNER
			});
		})
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
	const data = {map: values[0], routes: values[1]};
	return data
})