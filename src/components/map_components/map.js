
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { keys } from '../../keys';
import { polygonPaths, constructPolygonOnMap } from './polygon';
import { polylinePaths, constructPolylineOnMap } from './polyline';
import { constructDirectionsOnMap, getDirections } from './directions';
// import { nswGeoJson } from '../../data/nsw_js_geojson.js';
// console.log(nswGeoJson);
import { constructMarkerOnMap } from './markers';

let gMapInstance = null;
let gMapInternals = null;

export function getMapInstance() {
    return gMapInstance;
}

export function getMapInternals() {
    return gMapInternals;
}

export class Map extends Component {
    constructor(props) {
        super(props);
        console.log('checking props');
        console.log(props);

        this.state = {
            center: {
                lat: -33.873567,
                lng: 151.2068498
            },
            zoom: 13,
            mapInternals: undefined,
            mapInstance: undefined,
            startPlace: this.props.startPlace,
            endPlace: this.props.endPlace,
            markers: [],
            polylines: [],
        };

    }

  async renderMarkersAndDirections() {
        // this.drawGeoJson(mapInstance);
        console.log('render markers and directions');
        console.log(this.state);
        if (this.state.startPlace && this.state.endPlace) {
            // Remove previous markers and polyines.
            this.state.markers.map(marker => marker.setMap(null));
            this.state.polylines.map(pl => pl.setMap(null));

            const src = constructMarkerOnMap(this.state.mapInstance, this.state.mapInternals, this.state.startPlace['geometry']['location']);
            const dest = constructMarkerOnMap(this.state.mapInstance, this.state.mapInternals, this.state.endPlace['geometry']['location']);

            // We have a start and end, lets get directions!
            const directionApiReponse = await getDirections(this.state.startPlace['place_id'], this.state.endPlace['place_id']);
            const allRouteLines  = constructDirectionsOnMap(this.state.mapInstance, this.state.mapInternals, directionApiReponse)
            this.setState({
                markers: [src, dest], 
                polylines: allRouteLines,
            });

            this.props.onDirectionsRender(allRouteLines);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('will recieve props');
        console.log(nextProps);
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.startPlace !== this.state.startPlace) {
            this.setState({ startPlace: nextProps.startPlace }, () => this.renderMarkersAndDirections());
        }
        if (nextProps.endPlace !== this.state.endPlace) {
            this.setState({ endPlace: nextProps.endPlace }, () => this.renderMarkersAndDirections()
            );
        }

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
        this.setState({ mapInstance, mapInternals });

        console.log('google map: onMapLoad');
        console.log(mapInstance);
        console.log(mapInternals);
        // Add traffic roads.
        var trafficLayer = new mapInternals.TrafficLayer();
        trafficLayer.setMap(mapInstance);

        // // Collect polygons, might do something with them later.
        // const polygons = [];
        // // Draw all polygons.
        // polygonPaths.map((polygonCoords) => {
        //     const polygon = constructPolygonOnMap(mapInstance, mapInternals, polygonCoords, "#FF0000", 0.4, 2, "#FF0000", 0.35);
        //     polygons.push(polygon);
        // });
        // console.log(polygons);

        // // Collect polylines might do something with them later.
        // const polylines = [];
        // // Draw all polygons.
        // polylinePaths.map((polylineCoords) => {
        //     const polyline = constructPolylineOnMap(mapInstance, mapInternals, polylineCoords, "#0000FF", 0.8, 1);
        //     polylines.push(polyline);
        // });
        // console.log(polylines);
    }

    render() {
        return (
            <div style={{ height: '90vh', width: '80vw' }}>
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
