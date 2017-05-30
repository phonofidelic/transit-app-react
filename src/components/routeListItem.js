import React, { Component } from 'react';

class RouteListItem extends Component {

	render() {
		return (
			<li className="route-list-item" 
					style={{backgroundColor: this.props.color}}>
						{this.props.name} - {this.props.longName}
			</li>
		)
	}
}

export default RouteListItem;