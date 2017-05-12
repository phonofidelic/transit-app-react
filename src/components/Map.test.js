import React from 'react';
import ReactDOM from 'react-dom';
import MapComponent from './Map';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {rootReducer as initialState } from '../reducers';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<MapComponent />', () => {
	it('renders with default props', () => {
		const store = mockStore({initialState});
		const wrapper = shallow(
			<MapComponent store={store} />
		);
		expect(shallowToJson(wrapper)).toMatchSnapshot();
	});
});