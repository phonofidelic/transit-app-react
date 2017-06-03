import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class StopList extends Component {

	renderStops() {
		return (
			<ul>
				{this.props.stops.map((stop) => {
					return <li>{stop.stop_name}</li>
				})}
			</ul>
		);
	}

	render() {
		return (
			<div>stops{this.renderStops()}</div>
		);
	}
}

