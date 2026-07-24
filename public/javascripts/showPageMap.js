mapboxgl.accessToken = mapToken;

const coordinates = field.geometry.coordinates;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: coordinates,
    zoom: 10
});
new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${field.title}</h3><p>${field.location}</p>`
        )
    )
    .addTo(map);
