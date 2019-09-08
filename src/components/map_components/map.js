
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { keys } from '../../keys';
import { polygonPaths, constructPolygonOnMap } from './polygon';
import { polylinePaths, constructPolylineOnMap } from './polyline';
import { constructDirectionsOnMap, getDirections } from './directions';
// import { nswGeoJson } from '../../data/nsw_js_geojson.js';
// console.log(nswGeoJson);
import {parkingGeoJson} from '../../data/pOffstreetParkingData'
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
            intervals: [],
            throttleCount: this.props.throttleCount,
        };

    }

  async renderMarkersAndDirections() {
        console.log('render markers and directions');
        console.log(this.state);
        if (this.state.startPlace && this.state.endPlace) {
            // Remove previous markers and polyines.
            // this.state.markers.map(marker => marker.setMap(null));
            // this.state.polylines.map(routePolylines => {
            //     // Drawn polylines.
            //     routePolylines[0].map(pl => pl.setMap(null));
            //     // Animation polyline.
            //     routePolylines[1].setMap(null)
            // });

            const src = constructMarkerOnMap(this.state.mapInstance, this.state.mapInternals, this.state.startPlace['geometry']['location'], `Starting at ${this.state.startPlace["formatted_address"]}`);
            const dest = constructMarkerOnMap(this.state.mapInstance, this.state.mapInternals, this.state.endPlace['geometry']['location'], `Ending at ${this.state.endPlace["formatted_address"]}`);

            // We have a start and end, lets get directions!
            const directionApiReponse = await getDirections(this.state.startPlace['place_id'], this.state.endPlace['place_id']);
            const { allRouteLines, allIntervals}  = constructDirectionsOnMap(this.state.mapInstance, this.state.mapInternals, directionApiReponse)
            this.setState({
                markers: [src, dest], 
                polylines: allRouteLines,
                intervals: allIntervals,
            });

            this.props.onDirectionsRender(allRouteLines);
        }
    }

    animateCircle(line, speed) {
        var count = 0;
        return window.setInterval(function () {
            count = (count + 1) % 200;
    
            var icons = line.get('icons');
            icons[0].offset = (count / 2) + '%';
            // can use this to get rid of icons / control the pace of things.
            line.set('icons', icons);
            // quarter of a second.
        }, speed);
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
        if (nextProps.throttleCount !== this.state.throttleCount) {
            console.log('updating throttle speeds')
            // Need to update animations.
            const allNewIntervalRefs = [];
            this.state.intervals.map((intervalData, i) => {
                // clear timeout. 
                window.clearTimeout(intervalData[0]);

                // update spoeed.
                // bottle next is the last one. 
                let offset = 50;
                // make last one faster, make others slower.
                if (i === this.state.polylines.length - 1) {
                    offset = -300
                }
                const updatedSpeed = intervalData[1] + offset;
                console.log(`index: ${i} old speed: ${intervalData[1]} new speed: ${updatedSpeed}`)
                // set animtions on aimating polyline. 
                const animatingPolyline = this.state.polylines[i][1];
                const newIntervalRef = this.animateCircle(animatingPolyline, updatedSpeed);
                allNewIntervalRefs.push([newIntervalRef, updatedSpeed]);
            })
            this.setState({throttleCount: nextProps.throttleCount, 
                intervals: allNewIntervalRefs,
            });

        }

    }
    drawParkingMarker(mapInstance, mapsInternals, markerLatLng, string) {
            const parkingIconUrl = "https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png";
        
        const marker = new mapsInternals.Marker({position: markerLatLng, map: mapInstance, icon: parkingIconUrl});
        const infoWindow = new mapsInternals.InfoWindow({
            content: string
        });
        marker.addListener('mouseover', function() {
            infoWindow.open(mapInstance, this);
        });
        
        // assuming you also want to hide the infowindow when user mouses-out
        marker.addListener('mouseout', function() {
            infoWindow.close();
        });
        return marker;
    }

    drawGeoJson(mapInstance, mapInternals) {
      
        parkingGeoJson["features"].map(parkingInfo => {
            const lat = parkingInfo["geometry"]["coordinates"][1];
            const lng = parkingInfo["geometry"]["coordinates"][0];
            const properties = parkingInfo["properties"];
            const infoString = ` ${properties["Total_number_of_bays"]} available parking spots at ${properties["Building_name_location"]} ${properties["Street_Number_GPS"]} ${properties["Street_Name_GPS"]}`
            this.drawParkingMarker(mapInstance, mapInternals, {lat, lng}, infoString);
        });
        // mapInstance.data.setStyle({
        //     fillColor: 'green',
        //     strokeWeight: 1,
        //     strokeOpacity: 0.4,
        // });
        // mapInstance.data.loadGeoJson(parkingGeoJson);
        // console.log(mapInstance.data);
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
        // this.drawGeoJson(mapInstance, mapInternals);

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
