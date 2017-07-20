import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RouteList from './RouteList';
import TripDisplay from './TripDisplay';

class ListContainer extends Component {

	constructor(props) {
		super(props);

		this.props.init();
	}

	render() {
		const { showTripPlanner, maneuvers } = this.props;
		return (
			<div>
					{ showTripPlanner && maneuvers.length ? <TripDisplay /> : <RouteList />}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showTripPlanner: state.tripPlannerReducer.showTripPlanner,
		maneuvers: state.tripPlannerReducer.maneuvers
	}
}

export default connect(mapStateToProps, actions)(ListContainer);