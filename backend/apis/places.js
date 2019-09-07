const keys = require('../keys');
var fetch = require('node-fetch')

console.log(keys.map);

function endpointFormatter(queryLocation) {
    // replace whitespace with plus.
    const parsedQuery = queryLocation.replace(" ", "+");
    console.log(`[places] parsedQuery:  ${parsedQuery}`)
    return `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${parsedQuery}&key=${keys.map}`
}

class MapsPlacesApiHandler {

    /** Query the maps Places API. */
    async queryForLocation(queryLocation) {
   
        const response = await fetch(endpointFormatter(queryLocation));
        const fulfilled = await response.json();
        console.log('[places] response:');
        console.log(fulfilled);
        return fulfilled;
    }
}

module.exports = MapsPlacesApiHandler;