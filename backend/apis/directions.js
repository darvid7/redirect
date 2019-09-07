

const keys = require('../keys');
var fetch = require('node-fetch')

console.log(keys.map);

function endpointFormatter(srcPlaceId, destPlaceId) {
    // replace whitespace with plus.
    console.log(`[directions] src: ${srcPlaceId}, dest: ${destPlaceId}`)
    // Place ids need a prefix, origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE
    return `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${srcPlaceId}&destination=place_id:${destPlaceId}&provideRouteAlternatives=true&key=${keys.map}`
}

class MapsDirectionsApiHandler {

    /** Query the maps Directions API. */
    async queryForDirections(srcPlaceId, destPlaceId) {
   
        const response = await fetch(endpointFormatter(srcPlaceId, destPlaceId));
        const fulfilled = await response.json();
        console.log('[directions] response:');
        console.log(fulfilled);
        return fulfilled;
    }
}

module.exports = MapsDirectionsApiHandler;