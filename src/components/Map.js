import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
const L = window.L;

class MapComponent extends Component {

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
		
	}
}

export default connect(mapStateToProps, actions)(MapComponent);