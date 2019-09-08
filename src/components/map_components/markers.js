/** Handles drawing markers on the map. */

export function constructMarkerOnMap(mapInstance, mapsInternals, markerLatLng, 
    string) {
        console.log('constructing marker');

    const marker = new mapsInternals.Marker({position: markerLatLng, map: mapInstance});
   // don't need this!
    // marker.setMap(mapInstance);
    console.log(`marker string: ${string}`)
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