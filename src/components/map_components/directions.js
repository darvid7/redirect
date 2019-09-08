import { canvaToGoogleDirections, canvaToGoogleAlt, combinedC2G, g2home } from '../../data/map_cache/directions_cache';
import { constructPolylineOnMap } from './polyline';
import { congestionLevels } from '../../data/traffic_congestion';
import carIcon from '../../data/car.svg';
import { carSvgPath } from '../../data/carSvg';

// TODO: incrementally cache backend?
const USE_CACHE = true;
function getDirectionsEndpoint(startId, endId) {
    return `http://localhost:8888/directions/${startId}&${endId}`;
}

export async function getDirections(startId, endId) {
    if (USE_CACHE) {
        return g2home;
    }
    const response = await fetch(getDirectionsEndpoint(startId, endId));
    const directions = await response.json();

    return directions
}

// Returns color for a polyline w/ a high bias.
function converter(restraint = false) {
    let max = 17;
    if (restraint) {
        max = 5;
    }
    const min = 0;
    const v = Math.floor(Math.random() * (+max - +min)) + +min;
    console.log(`v calc: ${v}`);
    switch (v) {
        case 1:
            return congestionLevels['veryLow']
            break;
        case 2:
            return congestionLevels['veryLow']
            break;
        case 3:
            return congestionLevels['veryLow']
            break;
        case 4:
            return congestionLevels['low']
            break;
        case 5:
            return congestionLevels['med']
            break;
        case 6:
            return congestionLevels['high']
            break;
        case 7:
            return congestionLevels['high']
            break;
        case 8:
            return congestionLevels['high']
            break;
        case 9:
            return congestionLevels['veryHigh']
            break;
        case 10:
            return congestionLevels['veryHigh']
            break;
        case 11:
            return congestionLevels['veryHigh']
            break;
        case 12:
            return congestionLevels['veryHigh']
            break;
        case 13:
            return congestionLevels['high']
            break;
        case 14:
            return congestionLevels['veryHigh']
            break;
        case 15:
            return congestionLevels['high']
            break;
        case 16:
            return congestionLevels['veryHigh']
            break;
        case 17:
            return congestionLevels['high']
            break;
        default:
            return congestionLevels['med']
    }
}
function animateCircle(line, speed) {
    var count = 0;
    window.setInterval(function () {
        count = (count + 1) % 200;

        var icons = line.get('icons');
        icons[0].offset = (count / 2) + '%';
        // can use this to get rid of icons / control the pace of things.
        line.set('icons', icons);
        // quarter of a second.
    }, speed);
}

function getSpeed(isLast) {
    if (isLast) {
        return 4000; // 4 seconds.
    }
    const max = 1000;
    const min = 100;
    const speed = Math.floor(Math.random() * (+max - +min)) + +min;
    return speed;
}

export function constructDirectionsOnMap(mapInstance, mapInternals, directionsResponse) {
    // routes[0] as only one route here.
    // create 2 types of polylines 
    // 1. animation line, fully connectted.
    // 2. diff color lines.
    const allRouteLines = [];
    const routes = directionsResponse["routes"].reverse();
    // so final con is drawn o.
    routes.map((route, routeIndex) => {

        const drawnPolylines = [];
        console.log(route);
        const segments = route["legs"][0]["steps"];
        console.log(segments);
        const animationLineCoords = [];
        segments.map((segment, i) => {
            const startLatLng = segment["start_location"]
            const endLatLng = segment["end_location"]

            // Only need end point for last one as every other segment end point
            // is a segment start point. s - m - e 
            animationLineCoords.push(startLatLng);
            if (i === segments.length - 1) {
                animationLineCoords.push(endLatLng);
            }
            // consider route congestion.
            // let c = congestionLevels['low'];
            // if (!(i == 0 || i === segments.length - 1)) {
            //     const c = converter();
            //     // only consider middle portions.
            // }
            drawnPolylines.push(constructPolylineOnMap(mapInstance, mapInternals, [startLatLng, endLatLng], routeIndex === routes.length - 1 ? converter() : converter(true), 0.8, 5));
        });

        // This is traffic.
        const lineSymbol = {
            path: carSvgPath,
            // scale: 8,
            // strokeColor: '#393',
            fillColor: 'grey',
            fillOpacity: 1,
            scale: 0.05,
            strokeColor: 'black',
            strokeWeight: 1
        };

        // Need to be on map to render icons, set width to lower.
        // rgba to make line hidden on map w/ opacity, car appears on top!.
        const animationPolyline = constructPolylineOnMap(mapInstance, mapInternals, animationLineCoords, 'rgba(255, 255, 255, 0)', 1, 5, [{
            icon: lineSymbol,
            offset: '50%',
            repeat: '8%'
        }]);
        animateCircle(animationPolyline, getSpeed(routeIndex === routes.length - 1));
        allRouteLines.push([drawnPolylines, animationPolyline]);

        mapInternals.event.addListener(animationPolyline, 'mouseover', function(latlng) {
            animationPolyline.setOptions({strokeColor: 'rgba(255, 0, 255)'});
        });

        mapInternals.event.addListener(animationPolyline, 'click', function(latlng) {
            // animationPolyline.setOptions({strokeColor: 'rgba(255, 0, 255)'});
            // alert(1);
            // const infoWindow = new mapInternals.InfoWindow({
            //     content: "hi"
            //   });
            // infowindow.setContent(content);
            // infowindow.setPosition(event.latLng);
            // infowindow.open(map);
         

        });

        mapInternals.event.addListener(animationPolyline, 'mouseout', function(latlng) {
            animationPolyline.setOptions({strokeColor: 'rgba(255, 255, 255, 0)'});
        });

    });
    return allRouteLines;
}