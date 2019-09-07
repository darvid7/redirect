import React, { Component } from 'react';
import { MapsPlacesApiHandler } from '../apis/places';
import { getMapInstance, getMapInternals } from './map_components/map';
import { canvaPlacesApiResponse, googlePlacesApiResponse } from '../data/map_cache/places_cache';

const USE_CACHE = true;

function getPlacesEndpoint(query) {
    return `http://localhost:8888/places/${query}`;
}

export class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            start: 'google',
            end: 'canva'
        };
    
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

      }
    
    async callPlacesApi(query) {
        if (USE_CACHE) {
            if (query.includes('canva')) {
                return canvaPlacesApiResponse;
            }
            return googlePlacesApiResponse;
        }
        const response = await fetch(getPlacesEndpoint(query));
        const place = await response.json();
        // Could index error here but yolo?
        if (place['results'].length < 1) {
            return false;
        }
        const mostLikelyPlace = place['results'][0];
        return mostLikelyPlace;
    }

    async handleSubmit() {
        if (!(this.state.start || this.state.end)) {
            return;
        }
        const startPlace = await this.callPlacesApi(this.state.start);
        const endPlace = await this.callPlacesApi(this.state.end);
        if (!(startPlace && endPlace)) {
            alert('Can not locate places!');
        }
        console.log(`start: ${JSON.stringify(startPlace)}`);
        console.log(`end: ${JSON.stringify(endPlace)}`);

        this.props.updateStart(startPlace);
        this.props.updateEnd(endPlace);

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