import React from 'react';
import ReactDOM from 'react-dom';
import MapComponent from './Map';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MapComponent />, div);
});