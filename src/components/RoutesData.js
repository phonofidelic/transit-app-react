import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

export default function(ComposedComponent) {
	class RoutesData extends Component {
		constructor(props) {
			super(props);

			this.props.fetchNearbyRoutes();
		}

		render() {
			return <ComposedComponent {...this.props} routes={this.props.routes} />
		}
	}

	const mapStateToProps = (state) => {
		return {
			routes: state.routeListReducer.routes,
			isFetching: state.routeListReducer.isFetching,
			lastUpdated: state.routeListReducer.lastUpdated
		}
	}

	return connect(mapStateToProps, actions)(RoutesData);
}
