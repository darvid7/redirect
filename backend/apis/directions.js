

const keys = require('../keys');
var fetch = require('node-fetch')

console.log(keys.map);

function endpointFormatter(srcPlaceId, destPlaceId) {
    // replace whitespace with plus.
    console.log(`[directions] src:${srcPlaceId}, dest:${destPlaceId}`)
    // Place ids need a prefix, origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE
    return `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${srcPlaceId}&destination=place_id:${destPlaceId}&provideRouteAlternatives=true&key=${keys.map}`
}

function endpointFormatterWaypoint(srcPlaceId, destPlaceId, intermediateId) {
    // replace whitespace with plus.
    console.log(`[directions + waypoint] src:${srcPlaceId}, dest:${destPlaceId}, waypoint:${intermediateId}`)
    // Place ids need a prefix, origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE
    // console.log(`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${srcPlaceId}&destination=place_id:${destPlaceId}&waypoints=place_id:${intermediateId}&key=${keys.map}`);
    return `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${srcPlaceId}&destination=place_id:${destPlaceId}&waypoints=via:place_id:${intermediateId}&key=${keys.map}`
}

class MapsDirectionsApiHandler {

    /** Query the maps Directions API. */
    async queryForDirections(srcPlaceId, destPlaceId, waypoint = false, intermediateId = '') {
        let response;
        if (waypoint) {
            response = await fetch(endpointFormatterWaypoint(srcPlaceId, destPlaceId, intermediateId));
        } else {
            response = await fetch(endpointFormatter(srcPlaceId, destPlaceId));
        }
        const fulfilled = await response.json();
        console.log('[directions] response:');
        console.log(fulfilled);
        return fulfilled;
    }
}

module.exports = MapsDirectionsApiHandler;