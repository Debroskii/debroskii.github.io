// 1. Initialize the map centered over a specific area
const map = L.map('map').setView([36.2048, 138.2529], 7); // New York City

const shrek = 'E4FsT7gJ5x6vfQvbP5zR';

// 2. Add OpenStreetMap tile layer
const mtLayer = L.maptiler.maptilerLayer({
    apiKey: shrek,
    style: L.maptiler.MapStyle.STREETS, // optional
    language: L.maptiler.Language.ENGLISH, //change the default language
  }).addTo(map);

// 3. Define photo data with geographic coordinates
const photos = [
    
];

compileRegistryForMap()

function compileRegistryForMap() {
    for(let key of Object.keys(Registry.registryObj)) {
        let obj = Registry.registryObj[key];
        let latlon = obj.latlon;
        if(latlon != null) {
            photos.push({
                url: "data/thumbnails/" + key,
                bigUrl: "data/" + key,
                lat: latlon[0],
                lng: latlon[1],
                caption: `Captured by: ${obj.owner}`
            });
        }
    }
}

// 4. Loop through photos and generate markers
photos.forEach(photo => {
    // Create a custom icon using an HTML <img> tag
    let size = innerWidth < 1000 ? 150 : 50; // Adjust size based on screen width
    const photoIcon = L.divIcon({
        html: `<img src="${photo.url}" class="photo-marker" width="${size}rem" height="${size}rem">`,
        iconSize: [size, size],
        iconAnchor: [25, 25],
        className: 'custom-image-icon' // Removes default Leaflet styling
    });

    // Add marker to the map and bind a popup for when it is clicked
    L.marker([photo.lat, photo.lng], { icon: photoIcon })
        .addTo(map)
        .bindPopup(`
            <b style="display:block; margin-bottom:5px;">${photo.caption}</b>
            <img src="${photo.bigUrl}" width="300rem" style="border-radius:4px;">
        `);
});