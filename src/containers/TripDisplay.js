import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ManeuverItem from '../components/ManeuverItem';

class TripDisplay extends Component {

	renderManeuverList() {
		return (
			<ul>
				{this.props.maneuvers.map((maneuver, i) => {
					if (maneuver) {
						return <ManeuverItem key={i}
																 id={maneuver.id}
																 index={maneuver.index}
																 instruction={maneuver.verbal_pre_transition_instruction}
																 travelMode={maneuver.travel_mode}
																 coords={maneuver.coords}
																 isSelected={this.props.maneuvers[i].isSelected}
																 map={this.props.map}
																 centerOnCoords={this.props.centerOnCoords}
																 selectManeuver={this.props.selectManeuver} />
					}
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
	console.log('### TripDisplay, state:', state)
	return {		
		tripDisplay: state.tripPlannerReducer.tripDisplay,
		maneuvers: state.tripPlannerReducer.maneuvers,
		showTripPlanner: state.tripPlannerReducer.showTripPlanner,
		selectedManeuver: state.tripPlannerReducer.selectedManeuver,
		map: state.mapReducer.map
	}
}

export default connect(mapStateToProps, actions)(TripDisplay)