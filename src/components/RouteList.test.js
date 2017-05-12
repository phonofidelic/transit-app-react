import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RouteList } from './RouteList';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {INITIAL_STATE as featureComponent } from '../reducers/routelistReducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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