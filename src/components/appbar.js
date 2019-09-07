import React, { Component } from 'react';
import logo from '../logo.svg';

export class AppBar extends Component {

    render() {
        return (
            <div style={{ width: "100vw", backgroundColor: "blue", height: "5vh", paddingBottom: "10px", display: "flex" }}>
                <img style={{ width: "50px", height: "50px" }} src={logo} className="App-logo" alt="logo" />
                <div style={{ alignText: 'center', flex: 5, paddingTop: "10px" }}>
                    Mapped
                </div>
            </div>
        )
    }
}