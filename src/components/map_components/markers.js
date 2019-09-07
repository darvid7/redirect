/** Handles drawing markers on the map. */

export function constructMarkerOnMap(mapInstance, mapsInternals, markerLatLng, 
    ) {
        console.log('constructing marker');
    const marker = new mapsInternals.Marker({position: markerLatLng, map: mapInstance});
   // don't need this!
    // marker.setMap(mapInstance);
    return marker;
}