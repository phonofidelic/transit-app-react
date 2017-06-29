import React, { Component } from 'react';
import { connect } from 'react-redux';
import  * as actions from '../actions';
// import StopList from './StopList';

class RouteListItem extends Component {

	renderStops() {
		console.log('@renderStops, this.props.stops:', this.props.stops)
		return (
			<ul className="stop-list">
				{this.props.stops.map((stop) => {
					return <li className="stop-list-item" key={stop.stop_onestop_id}>{stop.stop_name}</li>
				})}
			</ul>
		);
	}

	render() {
		const { selected } = this.props


		return (
			<li className="route-list-item" 
					style={{backgroundColor: this.props.color}}
					onClick={() => {this.props.selectRoute(this.props.routes, this.props.onestopId)}}
					>
				<div className="route-list-item-header">
					{this.props.name} - {this.props.longName} {this.props.index === 0 ? ' - first' : null}
					
				</div>
				{selected ? this.renderStops() : null}
			</li>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		routes: state.routeListReducer.routes
	}
}

export default connect(mapStateToProps, actions)(RouteListItem);