import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RouteListItem from './routeListItem';
import RoutesData from './RoutesData';

export class RouteList extends Component {

	renderList() {
		return (
			<ul>
				{this.props.routes.map((route, i) => {
					return <RouteListItem key={i} name={route.name} />
				})}
			</ul>			
		);
	}

	render() {
		const { isFetching, routes } = this.props;
		return (
			<div className="route-list-container">
				route list
				{isFetching && routes.length === 0 && <div>loading...</div>}
				{routes.length > 0 && this.renderList()}
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


