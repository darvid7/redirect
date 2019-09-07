import React, { Component } from 'react';
import { MapsPlacesApiHandler } from '../apis/places';
import { getMapInstance, getMapInternals } from './map_components/map';

function getPlacesEndpoint(query) {
    return `http://localhost:8888/places/${query}`;
}

export class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            start: '',
            end: ''
        };
    
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

      }
    
    async callPlacesApi(query) {
        const response = await fetch(getPlacesEndpoint(query));
        const start = await response.json();
        // Could index error here but yolo?
        if (start['results'].length < 1) {
            return false;
        }
        const startPlace = start['results'][0];
        return startPlace;
    }

    async handleSubmit() {
        const startPlace = await this.callPlacesApi(this.state.start);
        const endPlace = await this.callPlacesApi(this.state.end);
        if (!(startPlace && endPlace)) {
            alert('Can not locate places!');
        }
        console.log(`start: ${JSON.stringify(startPlace)}`);
        console.log(`end: ${JSON.stringify(endPlace)}`);

    }


    handleStartChange(event) {
        this.setState({ start: event.target.value });
    }

    handleEndChange(event) {
        this.setState({ end: event.target.value });
    }

    render() {
        return (
            <div style={{
                width: "20vw",
                backgroundColor: "red",
                display: "flex"
            }}>

                <form >

                    Start: <input type="text" value={this.state.start} onChange={this.handleStartChange}>
                    </input><br />

                    End: <input type="text" value={this.state.end} onChange={this.handleEndChange}>
                    </input><br />

                    <input value="Submit" onChange={() => { console.log("shouldn't happen") }} onClick={() => this.handleSubmit()}></input>
                </form>
            </div>
        )
    }
}