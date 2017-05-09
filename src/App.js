import React, { Component } from 'react';
import Header from './components/Header';
import MapComponent from './components/Map';
import RouteList from './components/RouteList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <MapComponent />
        <RouteList />
      </div>
    );
  }
}

export default App;
