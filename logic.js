// Create function to determine marker size and color based on earthquake
function getColor(d) {
    return d > 5  ? '#E31A1C':
    d > 4  ? '#FC4E2A':
    d > 3  ? '#FD8D3C':
    d > 2  ? '#FEB24C':
    d > 1  ? '#FED976':
    '#FFEDA0';
}

// Store API endpoint inside queryURL
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform GET request to the queryURL
d3.json(queryURL, function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>" + feature.properties.place + 
        "<h3><hr><p>" + new Date(feature.properties.time) + "<p>" );
    }
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });
    
    // Send earthquakes layer to createMap function
    createMap(earthquakes);
    function pointToLayer(feature,latlng){
        return new L.circle(latlng,{
            stroke:false,
			fillOpacity: 0.7,
			fillColor:getColor(feature.properties.mag),
			radius: feature.properties.mag * 50000
   		})
   	}
}

function createMap(earthquakes) {
    // Define outdoor and satellite map layers
    let outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXluYW1laXNqb2hubiIsImEiOiJjamgxYWhtcmEwMjN1MnlrNGdocmZrcDI2In0.RaPICOWYP3Bvq0DyjQ7jog");
    let satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10.html/tiles/256/{z}/{x}/{y}?" +
    	"access_token=pk.eyJ1IjoibXluYW1laXNqb2hubiIsImEiOiJjamgxYWhtcmEwMjN1MnlrNGdocmZrcDI2In0.RaPICOWYP3Bvq0DyjQ7jog");

    // Define baseMaps to hold baselayers
    let baseMaps = {
        "Outdoor Map":outdoorMap,
    	"Satellite Map":satelliteMap
    };

    // Create overlay object to hold the overlay layer
    let overlayMaps = {
    	Earthquakes: earthquakes
    };

    // Creating map object
    let myMap = L.map("map",{
    	center: [39.833333, -98.583333],
    	zoom: 4.50,
    	layers:[outdoorMap, earthquakes]
    });

    // Create a layer control
    L.control.layers(baseMaps,overlayMaps,{
        collapse: false
    }).addTo(myMap);   

// Setting up the legend
let legend = L.control({position: "bottomright"});
legend.onAdd = function (myMap) {
    let div = L.DomUtil.create("div", "info legend"),
    grades = [1,2,3,4,5],
    labels = [];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

// Adding legend to the map
legend.addTo(myMap);
 };  