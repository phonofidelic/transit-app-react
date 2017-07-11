import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RouteListItem from '../components/RouteListItem';
// import RoutesData from './RoutesData';

export class RouteList extends Component {

	constructor(props) {
		super(props);

		this.props.init();
	}

	renderList(error) {
		return (
			<ul>
				{this.props.routes.map((route, i) => {
					return <RouteListItem key={route.onestop_id}
																index={i}
																onestopId={route.onestop_id}
																name={route.name}
																longName={route.tags.route_long_name}
																color={route.color}
																stops={route.stops_served_by_route.slice(0, 9)}
																selected={route.selected}
																route={route}
																className="route-list-item" />
				})}
			</ul>
		);
	}

	renderError() {
		return (
			<div>Error: {this.props.error}</div>
		);
	}

	render() {
		const { isFetching, error, routes, showTripPlanner } = this.props;
		return (
			<div className="route-list">
				{isFetching && routes.length === 0 && <div>loading...</div>}
				{routes && !showTripPlanner ? this.renderList() : null}
				{error && this.renderError(error.message)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		routes: state.routeListReducer.routes,
		isFetching: state.routeListReducer.isFetching,
		lastUpdated: state.routeListReducer.lastUpdated,
		error: state.routeListReducer.error,
		showTripDisplay: state.tripPlannerReducer.showTripDisplay,
		showTripPlanner: state.tripPlannerReducer.showTripPlanner
	}
}

export default connect(mapStateToProps, actions)(RouteList);


