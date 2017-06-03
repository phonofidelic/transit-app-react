import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RouteListItem from './RouteListItem';
import RoutesData from './RoutesData';

export class RouteList extends Component {

	renderList(error) {
		return (
			<ul>
				{this.props.routes.map((route) => {
					return <RouteListItem key={route.onestop_id}
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
		const { isFetching, error, mapLoaded, routes } = this.props;
		return (
			<div>
				{isFetching && routes.length === 0 && <div>loading...</div>}
				{routes && this.renderList()}
				{error && this.renderError(error)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// routes: state.routeListReducer.routes,
		// isFetching: state.routeListReducer.isFetching,
		// lastUpdated: state.routeListReducer.lastUpdated
		error: state.routeListReducer.error
	}
}

export default connect(mapStateToProps, actions)(RoutesData(RouteList));


