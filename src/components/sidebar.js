import React, { Component } from 'react';
import {MapsPlacesApiHandler} from '../apis/places';
import {getMapInstance, getMapInternals} from './map_components/map';

let placesApi = null;
export class SideBar extends Component {
   

    initAndCallPlacesApi() {
        if (!placesApi) {
            // Hacky and is suspect to rendering Map properly.
            console.log('hm');
            console.log(getMapInstance());
            console.log(getMapInternals());

            placesApi = new MapsPlacesApiHandler(
                new getMapInternals().PlacesService(getMapInstance()))
        }
        (async () => { 
            const result = await placesApi.queryForLocation('google sydney');
            console.log(result);
        })();

    }
    render() {
        return (
            <div style={{
                width: "20vw",
                backgroundColor: "red",
                display: "flex"
            }}>
                
                <form action="/action_page.php">
                First name: <input type="text" name="fname"></input><br/>
                Last name: <input type="text" name="lname"></input><br/>
                <input value="Submit" onChange={() => {console.log("shouldn't happen")}} onClick={() => this.initAndCallPlacesApi()}></input>
                </form>
            </div>
        )
    }
}