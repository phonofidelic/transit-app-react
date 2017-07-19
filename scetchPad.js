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

