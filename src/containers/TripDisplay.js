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
															 instruction={maneuver.verbal_pre_transition_instruction}/>
				})}
			</ul>
		);
	}

	render() {
		const { showTripDisplay, maneuvers } = this.props;
		return (
			<div className="trip-display">
				{ showTripDisplay && <div className="trip-desplay-header">Trip Display <button onClick={() => {this.props.hideTripDisplay()}}>close</button></div> }
				{ showTripDisplay && this.renderManeuverList() }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {		
		showTripDisplay: state.tripPlannerReducer.showTripDisplay,
		maneuvers: state.tripPlannerReducer.tripData
	}
}

export default connect(mapStateToProps, actions)(TripDisplay)