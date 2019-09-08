import React, { Component } from 'react';
import './App.css';
import { Map } from './components/map_components/map';
import { AppBar } from './components/appbar';
import { SideBar } from './components/sidebar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startPlace: undefined,
      endPlace: undefined,
      polylines: [],
    }
  }
  render() {
    return (
      <div className="App" style={{ backgroundColor: "#fff", height: '100vh' }}>
        <AppBar></AppBar>
        <div style={{ display: 'flex', height: '90vh', margin: 'auto', zIndex: -5 }}>
          <Map
            startPlace={this.state.startPlace}
            endPlace={this.state.endPlace}
            onDirectionsRender={(directionRoutes) => this.setState({polylines: directionRoutes})}
          ></Map>
          <SideBar
            updateStart={(place) => this.setState({ startPlace: place })}
            updateEnd={(place) => this.setState({ endPlace: place })}
            polylines={this.state.polylines}
          ></SideBar>
        </div>

      </div>
    );
  }
}

export default App;
