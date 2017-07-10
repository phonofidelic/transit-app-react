import React, { Component } from 'react';
import Header from './components/Header';
import MapComponent from './components/Map';
import RouteList from './containers/RouteList';
import TripPlanner from './containers/TripPlanner';
import TripDisplay from './containers/TripDisplay';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <TripPlanner />
        <MapComponent />
        <RouteList />
        <TripDisplay />
      </div>
    );
  }
}

export default App;
