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
    }
  }
  render() {
    return (
      <div className="App" style={{ backgroundColor: 'green' }}>
        <AppBar></AppBar>
        <div style={{ display: 'flex' }}>
          <SideBar
            updateStart={(place) => this.setState({ startPlace: place })}
            updateEnd={(place) => this.setState({ endPlace: place })}
          ></SideBar>
          <Map
            startPlace={this.state.startPlace}
            endPlace={this.state.endPlace}
          ></Map>
        </div>

      </div>
    );
  }
}

export default App;
