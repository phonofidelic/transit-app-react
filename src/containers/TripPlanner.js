import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

class TripPlanner extends Component {

	renderDestinationInput() {
		return(
			<div>
				<TextField hintText="Where would you like to go?" />
				<FlatButton fullWidth={true} type="submit">Search</FlatButton>
			</div>
		);
	}

	render() {
		const { showTripPlanner } = this.props;
		return(
			<div className="trip-planner-container">
				<Paper className="trip-planner">
					<div onClick={() => {this.props.openTripPlanner()}}>Plan a trip</div>
					{showTripPlanner && this.renderDestinationInput()}
				</Paper>
			</div>
		);
	};
};

const mapStateToProps = state => {
	return {
		showTripPlanner: state.tripPlannerReducer.showTripPlanner
	}
}

export default connect(mapStateToProps, actions)(TripPlanner);