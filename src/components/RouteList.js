import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class RouteList extends Component {
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
		routes: state.routeListReducer.routes
	}
}

export default connect(mapStateToProps, actions)(RouteList);