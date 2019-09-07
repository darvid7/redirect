import { canvaToGoogleDirections } from '../../data/map_cache/directions_cache';
import { constructPolylineOnMap } from './polyline';
import { congestionLevels } from '../../data/traffic_congestion';

// TODO: incrementally cache backend?
const USE_CACHE = true;
function getDirectionsEndpoint(startId, endId) {
    return `http://localhost:8888/directions/${startId}&${endId}`;
}

export async function getDirections(startId, endId) {
    if (USE_CACHE) {
        return canvaToGoogleDirections;
    }
    const response = await fetch(getDirectionsEndpoint(startId, endId));
    const directions = await response.json();
    return directions
}

// Returns color for a polyline w/ a high bias.
function converter() {
    const max = 10;
    const min = 0;
    const v = Math.floor(Math.random() * (+max - +min)) + +min;
    console.log(`v calc: ${v}`);
    switch (v) {
        case 1:
            return congestionLevels['veryLow']
            break;
        case 2:
            return congestionLevels['low']
            break;
        case 3:
            return congestionLevels['med']
            break;
        case 4:
            return congestionLevels['high']
            break;
        case 5:
            return congestionLevels['high']
            break;
        case 6:
            return congestionLevels['high']
            break;
        case 7:
            return congestionLevels['veryHigh']
            break;
        case 8:
            return congestionLevels['veryHigh']
            break;
        case 9:
            return congestionLevels['veryHigh']
            break;
        default:
            return congestionLevels['med']
    }
}
function animateCircle(line) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
  }, 20);
}

export function constructDirectionsOnMap(mapInstance, mapInternals, directionsResponse) {
    const drawnPolylines = [];
    // routes[0] as only one route here.
    // create 2 types of polylines 
    // 1. animation line, fully connectted.
    // 2. diff color lines.
    const segments = directionsResponse["routes"][0]["legs"][0]["steps"];
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
        drawnPolylines.push(constructPolylineOnMap(mapInstance, mapInternals, [startLatLng, endLatLng], converter(), 1, 6));
    });
 
    // This is traffic.
    const lineSymbol = {
        path: mapInternals.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: '#393'
      };

    // Need to be on map to render icons, set width to lower.
    // rgba to make line hidden on map w/ opacity, car appears on top!.
    const animationPolyline = constructPolylineOnMap(mapInstance, mapInternals, animationLineCoords, 'rgba(255, 255, 255, 0)', 1, 1, [{
        icon: lineSymbol,
        offset: '50%'
      }],);
      animateCircle(animationPolyline);

    return { drawnPolylines, animationPolyline};
}