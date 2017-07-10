import React, { Component } from 'react';

class ManeuverItem extends Component {
	render() {
		return (
			<div className="maneuver-item">
				{this.props.instruction}
			</div>
		);
	}
}

export default ManeuverItem;