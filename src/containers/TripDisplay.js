import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ManeuverItem from '../components/ManeuverItem';

class TripDisplay extends Component {

	renderManeuverList() {
		return (
			<ul>
				{this.props.maneuvers.map((maneuver, i) => {
					return <ManeuverItem key={i} 
															 instruction={maneuver.verbal_pre_transition_instruction}
															 travelMode={maneuver.travel_mode} />
				})}
			</ul>
		);
	}

	render() {
		const { showTripPlanner, maneuvers } = this.props;
		return (
			<div className="trip-display">
				{ showTripPlanner && <div className="trip-desplay-header">Trip Display <button onClick={() => {this.props.hideTripDisplay()}}>close</button></div> }
				{ showTripPlanner && maneuvers ? this.renderManeuverList() : null }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {		
		tripDisplay: state.tripPlannerReducer.tripDisplay,
		maneuvers: state.tripPlannerReducer.tripData,
		showTripPlanner: state.tripPlannerReducer.showTripPlanner
	}
}

export default connect(mapStateToProps, actions)(TripDisplay)