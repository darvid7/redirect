import {keys} from '../keys';

function endpointFormatter(queryLocation) {
    // replace whitespace with plus.
    const parsedQuery = queryLocation.replace(" ", "+");
    console.log(`parsedQuery:  ${parsedQuery}`)
    return `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${parsedQuery}&key=${keys.map}`
}

export class MapsPlacesApiHandler {
    placesService;

    constructor(placesService) {
        this.placesService = placesService;
        console.log(this.placesService);
    }

    /** Query the maps Places API. */
   async queryForLocation(queryLocation) {
        console.log(`query:  ${queryLocation}`)
   
        const result = await fetch(endpointFormatter(queryLocation, {
            mode: 'no-cors', // no-cors, cors, *same-origin
            credentials: 'same-origin', //
        }));
        console.log(result);
        return result;
    }
}