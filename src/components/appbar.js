import React, { Component } from 'react';
import logo from '../logo.svg';

export class AppBar extends Component {

    render() {
        return (
            <div style={{ zIndex: 10000, width: "100vw", backgroundColor: "#fff", height: "10vh", display: "flex", boxShadow: '0 3px 6px rgba(0,0,0,0.16)' }}>
                <div style={{ fontFamily: "'Pacifico', cursive", alignText: 'center', flex: 5, margin: 'auto', fontSize: '38px', color: '#555'}}>
                    Redirect
                </div>
            </div>
        )
    }
}