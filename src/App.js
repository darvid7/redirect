import React from 'react';
import './App.css';
import {Map} from './components/map_components/map';
import {AppBar} from './components/appbar';
import {SideBar} from './components/sidebar';

function App() {
  return (
    <div className="App" style={{backgroundColor: 'green'}}>
      <AppBar></AppBar>
      <div style={{display: 'flex'}}>
      <SideBar></SideBar>
      <Map></Map>
      </div>
   
    </div>
  );
}

export default App;
