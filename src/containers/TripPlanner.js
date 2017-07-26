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


class TripPlanner extends Component {

	handleUpdateInput(value) {
		const { userPos } = this.props;
		this.props.handleDestInputChange(value, userPos);
	}

	renderDestinationInput() {
		const tripPlannerProps = {
			destinationInput: this.props.destinationInput,
			userPos: this.props.userPos, 
			autocompleteResults: this.props.autocompleteResults, 
			map: this.props.map,
			destMarker: this.props.destMarker,
			tripLineLayer: this.props.tripLineLayer,
			routeLineLayer: this.props.routeLineLayer
		};

		

		// const tripPlannerProps;
		const dataSourceConfig = {
			text: 'label',
			value: 'data'
		}
		return(
			<div>
				<AutoComplete hintText="Where would you like to go?"
									 		onUpdateInput={this.handleUpdateInput.bind(this)}
											dataSource={tripPlannerProps.autocompleteResults}
											dataSourceConfig={dataSourceConfig}
											value={tripPlannerProps.destinationInput}
											autoFocus={true} />

				<FlatButton fullWidth={true} onClick={() => {this.props.setDestination(tripPlannerProps)}}>Search</FlatButton>				
			</div>
		);
	};

	render() {
		const { showTripPlanner, map, routeLineLayer, tripLineLayer } = this.props;
		return(
			<div>
				<div className="trip-planner-container">
					<Paper className="trip-planner">
						{!showTripPlanner ? <div onClick={() => {this.props.openTripPlanner(); this.props.toggleRouteLineView(map, routeLineLayer, tripLineLayer)}}>Plan a trip</div> : this.renderDestinationInput('hello')}
					</Paper>					
				</div>
			</div>
		);
	};
};

const mapStateToProps = state => {
	console.log('state, map:', state.mapReducer.map)
	return {
		userPos: state.locationReducer.userPos,
		showTripPlanner: state.tripPlannerReducer.showTripPlanner,
		destinationInput: state.tripPlannerReducer.destinationInput,
		autocompleteResults: state.tripPlannerReducer.autocompleteResults,
		map: state.mapReducer.map,
		routeLineLayer: state.mapReducer.routeLineLayer,
		destMarker: state.mapReducer.destMarker,
		tripLineLayer: state.mapReducer.tripLineLayer
	}
};

export default connect(mapStateToProps, actions)(TripPlanner);