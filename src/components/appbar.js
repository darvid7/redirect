import React, { Component } from 'react';
import logo from '../logo.svg';

export class AppBar extends Component {

    render() {
        return (
            <div style={{ zIndex: 5, width: "100vw", backgroundColor: "#ff9800", height: "9vh", display: "flex", boxShadow: "0 1vh rgba(0, 0, 0, .4)", marginBottom: '1vh' }}>
                {/* <img style={{ width: "50px", height: "50px" }} src={logo} className="App-logo" alt="logo" /> */}
                <div style={{ fontFamily: "'Pacifico', cursive", alignText: 'center', flex: 5, margin: 'auto', fontSize: '38px', color: 'white'}}>
                    Redirect
                </div>
            </div>
        )
    }
}