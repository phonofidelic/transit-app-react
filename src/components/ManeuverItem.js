import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import * as actions from '../actions';
import * as moment from 'moment';
import { Divider } from 'material-ui';

class ManeuverItem extends Component {

	render() {
		let itemStyle,
				indicatorStyle;

		
		this.props.isSelected ? 
			itemStyle = {background: 'rgba(0, 0, 0, 0.12)'} 
			: null;

		this.props.travelMode === 'transit' ? 
			indicatorStyle = {background: this.props.transitColor}
			: null;
		// this.props.travelMode === 'transit' && !this.props.isSelected ? style.background = '#82df5a' : null;
		
		return (
			<div>
				<Divider />
				<div className="maneuver-item-container">
					{ this.props.travelMode === 'transit' ?
						<div className="maneuver-type-indicator" style={indicatorStyle}>
							transit
						</div>
						: null
					}
					<div className="maneuver-item" style={itemStyle} onClick={() => {this.props.selectManeuver(this.props.index); this.props.centerOnCoords(this.props.map, this.props.coords, this.props.focusMarker)}}>
						<div className="maneuver-time">Arrival Time: {moment(this.props.tripStartTime + this.props.arrivalTime).format('LT')}</div>
						{this.props.instruction} 
					</div>					
				</div>
			</div>
		);
	}
}

// const mapStateToProps = state => {
// 	return {
// 		isSelected: state.tripPlannerReducer.isSelected
// 	}
// }

// export default connect(mapStateToProps, actions)(ManeuverItem);
export default ManeuverItem;