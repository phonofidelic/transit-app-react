import React, { Component } from 'react';
import { Divider } from 'material-ui';

class ManeuverItem extends Component {
	render() {
		return (
			<div>
				<Divider />
				<div className="maneuver-item">
					{this.props.instruction} <span style={{textAlign: 'right'}}>{this.props.travelMode === 'transit' ? this.props.travelMode : null}</span>
				</div>
			</div>
		);
	}
}

export default ManeuverItem;