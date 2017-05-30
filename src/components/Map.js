import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RoutesData from './RoutesData';

class MapComponent extends Component {

	renderRouteLines() {
		const { routes, map } = this.props;
		this.props.updateMap(map, routes)
	}

	render() {
		return (
			<div id="map"></div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		map: state.mapReducer.map,
		mapLoaded: state.mapReducer.mapLoaded,
		routes: state.routeListReducer.routes
	}
}

export default connect(mapStateToProps, actions)(RoutesData(MapComponent));


