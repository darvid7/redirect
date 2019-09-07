/** Handles drawing polygons. */

/** List of polygons defined by lat / lng paths. 
 * Useful place to get granular data: https://nominatim.openstreetmap.org/details.php?place_id=198903232
 * TODO(someone): Can maybe do some parsing and put this on firebase?
 */
export const polygonPaths = [
    // A single rectangle made up of 4 points and closing at the first point.
    [
        { lat: -33.8814408, lng: 151.2044524 },
        { lat: -33.882, lng: 151.2044524 },
        { lat: -33.882, lng: 151.209 },
        { lat: -33.8814408, lng: 151.209 },
        { lat: -33.8814408, lng: 151.2044524 }
    ],

]

/** Wraps creating a google map Polygon and returns the Polygon instance. */
export function constructPolygonOnMap(map, mapsInternals, coords, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity) {
    const polygon = new mapsInternals.Polygon({
        paths: coords,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        fillColor,
        fillOpacity
    });
    polygon.setMap(map);
    return polygon;
}