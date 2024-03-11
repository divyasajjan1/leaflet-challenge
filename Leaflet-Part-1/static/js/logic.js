const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3.
d3.json(url).then(function (response){
    // Once we get a response, send the response.features object to the createFeatures function.
    createMarkers(response);
});

function getMarkerColor(depth){
    let markerColor = '';
    if (depth <= 10){
        markerColor = '#a6dc49';
    } else if(depth>10 && depth<=30){
        markerColor = '#ccdc5f';
    } else if (depth > 30 && depth <= 50) {
        markerColor = '#ecdc4b';
    } else if (depth > 50 && depth <= 70) {
        markerColor = '#fac158';
    } else if (depth > 70 && depth <= 90) {
        markerColor = '#faaa3b';
    } else if (depth > 90) {
        markerColor = '#fa6041';
    }
    return markerColor;
}

function createMarkers(earthquakeData){
    let markers = [];
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.

    earthquakeData.features.forEach(feature => {
        let magnitude = feature.properties.mag;
        let depth = feature.geometry.coordinates[2];
        let earthquakeMarker = L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            radius: magnitude*4,
            fillColor: getMarkerColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });


        let popupContent = `<h3>Location: ${feature.properties.place}</h3><hr><b>Time: ${new Date(feature.properties.time)}</b><br><b>Magnitude: ${magnitude}</b>`;
        earthquakeMarker.bindPopup(popupContent);
        markers.push(earthquakeMarker);
    });

    // Send our earthquakes layer to the createMap function/
    createMap(L.layerGroup(markers));
}

function createMap(earthquakes){
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 4,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend to display information about our map.
    let legend = L.control({
        position: "bottomright"
    });

    //Legend color definitions
    const colors = [
        { name: '-10 - 10', color: '#a6dc49' },
        { name: '10 - 30', color: '#ccdc5f' },
        { name: '30 - 50', color: '#ecdc4b' },
        { name: '50 - 70', color: '#fac158' },
        { name: '70 - 90', color: '#faaa3b' },
        { name: '90+', color: '#fa6041' }

    ];

    // Function to create legend items
    function createLegendItem(colorObj) {
        const legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');

        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = colorObj.color;

        const colorName = document.createElement('span');
        colorName.textContent = colorObj.name;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(colorName);

        return legendItem;
    }

    // When the layer control is added, insert a div with the class of "legend".
    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "legend");
        colors.forEach(color => {
            const legendItem = createLegendItem(color);
            div.appendChild(legendItem);
        });
        return div;
    };
    // Add the info legend to the map.
    legend.addTo(myMap);
   
}