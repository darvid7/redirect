/** Handles drawing polylines on maps. */

export const polylinePaths = [
    // A single polyline.
    [
        { lat: -33.8814408, lng: 151.2044524 },
        { lat: -33.882, lng: 151.2044524 },
        { lat: -33.883, lng: 151.209 },
        { lat: -33.881, lng: 151.215 },
    ],

]

/** Wraps creating a google map Polyline and returns the Polyline instance. */
export function constructPolylineOnMap(map, mapsInternals, coords, strokeColor, strokeOpacity, strokeWeight) {
    const polyline = new mapsInternals.Polyline({
        path: coords,
        geodesic: true,
        strokeColor,
        strokeOpacity,
        strokeWeight
    });
    polyline.setMap(map);
    return polyline;
}