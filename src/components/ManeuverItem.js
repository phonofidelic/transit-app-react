import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import * as actions from '../actions';
import { Divider } from 'material-ui';

class ManeuverItem extends Component {

	render() {
		let style;
		this.props.isSelected ? style = {background: '#ddd'} : style = {};
		return (
			<div>
				<Divider />
				<div className="maneuver-item" style={style} onClick={() => {this.props.selectManeuver(this.props.index)}}>
					{this.props.instruction} <span style={{textAlign: 'right'}}>{this.props.travelMode === 'transit' ? this.props.travelMode : null}</span>
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