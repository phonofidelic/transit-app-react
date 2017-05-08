import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
// const L = require('mapzen.js');
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
// import mapboxgl from 'mapbox-gl';
// const Tangram = window.Tangram;
const L = window.L;
// const L = require('leaflet/dist/leaflet');

// mapboxgl.accessToken = 'pk.eyJ1IjoicGhvbm9maWRlbGljIiwiYSI6ImNqMjc2OHhuaTAxZXYzM201MGhpNnA4bDQifQ.uYR_KibINj7JM0dRJwW4fQ';

// let position = [51.505, -0.09]


class MapComponent extends Component {
	constructor(props) {
		super(props);
		// this.props.getUserPos();		
	}

	componentDidMount() {
		this.renderMap();		
	}

	renderMap() {
		let position = [];
		navigator.geolocation.getCurrentPosition((pos) => {
			
			position.push(pos.coords.latitude, pos.coords.longitude);

			L.Mapzen.apiKey = 'mapzen-bynLHKb';
			let map = L.Mapzen.map('map', { scrollWheelZoom: false });
			const marker = L.circleMarker(position);
			marker.addTo(map);
			map.setView(position, 16);
		})
	}

	render() {
		return (
			<div id="map"></div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		location: state.userReducer.userPos
	}
}

export default connect(mapStateToProps, actions)(MapComponent);