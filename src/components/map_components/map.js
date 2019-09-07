
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { keys } from '../../keys';
import { polygonPaths, constructPolygonOnMap } from './polygon';
import { polylinePaths, constructPolylineOnMap } from './polyline';
// import { nswGeoJson } from '../../data/nsw_js_geojson.js';
// console.log(nswGeoJson);

let gMapInstance = null;
let gMapInternals = null;

export function getMapInstance() {
    return gMapInstance;
}

export function getMapInternals() {
    return gMapInternals;
}

export class Map extends Component {
    state = {
        center: {
            lat: -33.8814408,
            lng: 151.2044524
        },
        zoom: 17,
    }

    drawGeoJson(mapInstance) {
        mapInstance.data.setStyle({
            fillColor: 'green',
            strokeWeight: 1,
            strokeOpacity: 0.4,
        });
        mapInstance.data.loadGeoJson('https://data.gov.au/geoserver/nsw-suburb-locality-boundaries-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_91e70237_d9d1_4719_a82f_e71b811154c6&outputFormat=json');
        console.log(mapInstance.data);
    }

    /** Use to add Google Map internals to the GoogleMapReact object which doesn't support everything nicely. */
    onMapLoad(mapInstance, mapInternals) {
        // this doesn't work :(
        console.log(mapInstance.places);
        console.log(mapInternals.places);
        gMapInstance = mapInstance;
        gMapInternals = mapInternals;
        
        console.log('google map: onMapLoad');
        console.log(mapInstance);
        console.log(mapInternals);
        // Add traffic roads.
        var trafficLayer = new mapInternals.TrafficLayer();
        trafficLayer.setMap(mapInstance);

        // Collect polygons, might do something with them later.
        const polygons = [];
        // Draw all polygons.
        polygonPaths.map((polygonCoords) => {
            const polygon = constructPolygonOnMap(mapInstance, mapInternals, polygonCoords, "#FF0000", 0.4, 2, "#FF0000", 0.35);
            polygons.push(polygon);
        });
        console.log(polygons);

        // Collect polylines might do something with them later.
        const polylines = [];
        // Draw all polygons.
        polylinePaths.map((polylineCoords) => {
            const polyline = constructPolylineOnMap(mapInstance, mapInternals, polylineCoords, "#0000FF", 0.8, 1);
            polylines.push(polyline);
        });
        console.log(polylines);

        // this.drawGeoJson(mapInstance);
    }

    render() {
        return (
            <div style={{ height: '80vh', width: '80vw' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: keys.map }}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    // draggable={false}
                    scrollwheel={false}
                    // panControl: false,
                    maxZoom={this.state.zoom}
                    minZoom={this.state.zoom}
                    // layerTypes={['TransitLayer']}

                    onGoogleApiLoaded={({ map, maps }) => this.onMapLoad(map, maps)}
                >

                </GoogleMapReact>
            </div>
        );
    }

}
