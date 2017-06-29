import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

class TripPlanner extends Component {
	render() {
		return(
			<div className="trip-planner-container">
				<TextField hintText="plan a trip" />
			</div>
		);
	};
};

export default TripPlanner;