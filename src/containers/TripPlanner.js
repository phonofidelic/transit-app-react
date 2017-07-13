import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import TripDisplay from './TripDisplay';


class TripPlanner extends Component {

	handleUpdateInput(value) {
		const { userPos } = this.props;
		this.props.handleDestInputChange(value, userPos);
	}

	renderDestinationInput() {
		const {
			destinationInput, 
			userPos, 
			autocompleteResults, 
			map,
			destMarker,
			tripLayer
		} = this.props;
		const dataSourceConfig = {
			text: 'label',
			value: 'data'
		}
		return(
			<div>
				<AutoComplete hintText="Where would you like to go?"
									 		onUpdateInput={this.handleUpdateInput.bind(this)}
											dataSource={autocompleteResults}
											dataSourceConfig={dataSourceConfig}
											value={destinationInput}
											autoFocus={true} />

				<FlatButton fullWidth={true} onClick={() => {this.props.setDestination(autocompleteResults, userPos, map, destMarker, tripLayer)}}>Search</FlatButton>				
			</div>
		);
	};

	render() {
		const { showTripPlanner } = this.props;
		return(
			<div>
				<div className="trip-planner-container">
					<Paper className="trip-planner">
						{!showTripPlanner ? <div onClick={() => {this.props.openTripPlanner()}}>Plan a trip</div> : this.renderDestinationInput('hello')}
					</Paper>					
				</div>
				{/* <TripDisplay /> */}
			</div>
		);
	};
};

const mapStateToProps = state => {
	return {
		userPos: state.locationReducer.userPos,
		showTripPlanner: state.tripPlannerReducer.showTripPlanner,
		destinationInput: state.tripPlannerReducer.destinationInput,
		autocompleteResults: state.tripPlannerReducer.autocompleteResults,
		map: state.mapReducer.map,
		destMarker: state.mapReducer.destMarker,
		tripLayer: state.mapReducer.tripLayer
	}
};

export default connect(mapStateToProps, actions)(TripPlanner);