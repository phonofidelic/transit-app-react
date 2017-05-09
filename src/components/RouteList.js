import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class RouteList extends Component {
	constructor(props) {
		super(props);
		this.props.fetchNearbyRoutes();
	}
	render() {
		return (
			<div className="route-list-container">
				route list
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		routes: state.routeListReducer.routeList
	}
}

export default connect(mapStateToProps, actions)(RouteList);