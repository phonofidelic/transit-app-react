import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import * as actions from '../actions';
import { Divider } from 'material-ui';

class ManeuverItem extends Component {

	render() {
		let style;

		
		this.props.isSelected ? style = {background: 'rgba(0, 0, 0, 0.12)'} : style = {};
		// this.props.travelMode === 'transit' && !this.props.isSelected ? style.background = '#82df5a' : null;
		
		return (
			<div>
				<Divider />
				<div className="maneuver-item" style={style} onClick={() => {this.props.selectManeuver(this.props.index); this.props.centerOnCoords(this.props.map, this.props.coords, this.props.focusMarker)}}>
					{this.props.instruction} 
					<span style={{textAlign: 'right', background: '#82df5a'}}>
						{this.props.travelMode === 'transit' ? this.props.travelMode : null}
					</span>
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