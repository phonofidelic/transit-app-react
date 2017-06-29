import React from 'react';
import ReactDOM from 'react-dom';
import { RouteList } from './RouteList';
import { shallow } from 'enzyme';

function setup() {
	const props = {
		fetchNearbyRoutes: jest.fn(),
		routes: []
	}

	const enzymeWrapper = shallow(<RouteList {...props} />);

	return {
		props,
		enzymeWrapper
	}
}

describe('<RouteList />', () => {
	it('renders with default props', () => {

		const { enzymeWrapper } = setup();

		expect(enzymeWrapper).toMatchSnapshot();
	});
});