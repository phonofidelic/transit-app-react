import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {rootReducer as initialState } from './reducers';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<App />', () => {
	it('renders with default props', () => {
		const store = mockStore({initialState});
		const wrapper = shallow(
			<App store={store} />
		);
		expect(shallowToJson(wrapper)).toMatchSnapshot();
	});
});