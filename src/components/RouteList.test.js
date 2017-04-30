import React from 'react';
import ReactDOM from 'react-dom';
import RouteList from './RouteList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RouteList />, div);
});