import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class MapComponent extends Component {

	renderMap() {
		return (
			<div id="map" className="map-container"></div>
		);
	}

	render() {
		const { mapLoading, error } = this.props;
		return (
			<div id="map" className="map-container">
			{ mapLoading && <div style={{marginTop: '200px', zIndex: '1001'}}>loading map...</div> }		
			{ error && <div style={{marginTop: '200px'}}>{error}</div>}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// map: state.mapReducer.map,
		mapLoading: state.mapReducer.mapLoading,
		error: state.mapReducer.error
	}
}

export default connect(mapStateToProps, actions)(MapComponent);
// export default MapComponent;


