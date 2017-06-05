import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RoutesData from './RoutesData';

class MapComponent extends Component {

	render() {
		return (
			<div id="map"></div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		map: state.mapReducer.map,
		mapLoaded: state.mapReducer.mapLoaded
	}
}

export default connect(mapStateToProps, actions)(MapComponent);


