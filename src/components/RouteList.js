import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RouteListItem from './routeListItem';

class RouteList extends Component {

	constructor(props) {
		super(props);
		this.props.fetchNearbyRoutes();
	}

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
				{this.props.isFetching && routes.length === 0 && <div>loading...</div>}
				{routes.length > 0 && this.renderList()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		routes: state.routeListReducer.routes,
		isFetching: state.routeListReducer.isFetching
	}
}

export default connect(mapStateToProps, actions)(RouteList);