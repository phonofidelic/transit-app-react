import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

class MapComponent extends Component {

	renderMap() {
		return (
			<div id="map" className="map-container"></div>
		);
	}

	renderMapControlls() {
		const { map } = this.props;
		return (
			<div className="map-controls-container">
				<FloatingActionButton 
					mini={true} 
					className="map-control"
					style={{display: 'block'}}
					onClick={() => {this.props.handleZoomIn(map)}}>
					<ContentAdd />
				</FloatingActionButton>
				<FloatingActionButton 
					mini={true} 
					className="map-control"
					style={{display: 'block'}}
					onClick={() => {this.props.handleZoomOut(map)}}>
					<ContentRemove />
				</FloatingActionButton>
			</div>
		);
	}

	render() {
		const { mapLoading, map, error } = this.props;
		return (
			<div id="map" className="map-container">
			{ mapLoading && <div style={{marginTop: '200px', zIndex: '1001'}}>loading map...</div> }		
			{ error && <div style={{marginTop: '200px'}}>{error}</div>}
			{ map && this.renderMapControlls() }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		map: state.mapReducer.map,
		mapLoading: state.mapReducer.mapLoading,
		error: state.mapReducer.error
	}
}

export default connect(mapStateToProps, actions)(MapComponent);
// export default MapComponent;


