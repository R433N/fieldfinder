mapboxgl.accessToken = mapToken;

const coordinates = field.geometry.coordinates;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 10
});

new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);
