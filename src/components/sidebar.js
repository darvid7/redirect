import React, { Component } from 'react';
import { MapsPlacesApiHandler } from '../apis/places';
import { getMapInstance, getMapInternals } from './map_components/map';
import { canvaPlacesApiResponse, googlePlacesApiResponse } from '../data/map_cache/places_cache';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const USE_CACHE = true;

function getPlacesEndpoint(query) {
    return `http://localhost:8888/places/${query}`;
}

export class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 'google',
            end: 'canva',

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
                display: "flex",
                fontFamily: "'Source Serif Pro', serif"
            }}>
                <form style={{ display: 'flex', flexDirection: 'column', margin: '15px 32px', width: '100%' }}>

                    <TextField
                        id="standard-name"
                        label="Start location"
                        fullWidth
                        // className={classes.textField}
                        value={this.state.start}
                        onChange={this.handleStartChange}
                        margin="normal"
                        style={{ marginTop: '5px' }}
                    />

                    <TextField
                        id="standard-name"
                        label="Destination location"
                        fullWidth
                        // className={classes.textField}
                        value={this.state.end}
                        onChange={this.handleEndChange}
                        margin="normal"
                        style={{ marginTop: '5px' }}

                    />
                    <Button variant="contained" color="primary"
                        style={{ marginTop: '10px' }}

                        onClick={() => this.handleSubmit()}
                    >
                        Submit
                    </Button>

                    <Button variant="contained" color="primary"
                        style={{ marginTop: '10px' }}

                        onClick={() => this.props.handleThrottle()}
                    >
                        Redirect
                    </Button>
                   
                </form>


            </div>
        )
    }
}