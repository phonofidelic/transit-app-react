import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RouteListItem from './RouteListItem';
import RoutesData from './RoutesData';

export class RouteList extends Component {

	renderList() {
		return (
			<ul>
				{this.props.routes.map((route, i) => {
					return <RouteListItem key={i} 
																name={route.name}
																longName={route.tags.route_long_name}
																color={route.color}
																className="route-list-item" />
				})}
			</ul>			
		);
	}

	render() {
		const { isFetching, colorsSet, mapLoaded, routes } = this.props;
		return (
			<div>
				route list
				{isFetching && routes.length === 0 && <div>loading...</div>}
				{routes && this.renderList()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// routes: state.routeListReducer.routes,
		// isFetching: state.routeListReducer.isFetching,
		// lastUpdated: state.routeListReducer.lastUpdated
	}
}

export default connect(mapStateToProps, actions)(RoutesData(RouteList));


