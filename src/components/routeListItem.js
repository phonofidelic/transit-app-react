import React, { Component } from 'react';

class RouteListItem extends Component {

	render() {
		return (
			<li>{this.props.name}</li>
		)
	}
}

export default RouteListItem;