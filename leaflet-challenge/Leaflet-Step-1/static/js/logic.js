// Link to Json file
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Creating map object
var myMap = L.map("map", {
    center: [39.833333, -98.583333],
    zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Function that returns colors
function getColor(d) {
    if (d > 5) {return "teal"}
    else if (d >= 4) {return "lightseagreen"}
    else if (d >= 3) {return "turquoise"}
    else if (d >= 2) {return "aquamarine"}
    else if (d >= 1) {return "aqua"}
    else if (d === "5+") {return "teal"}
    else if (d === "4-5") {return "lightseagreen"}
    else if (d === "3-4") {return "turquoise"}
    else if (d === "2-3") {return "aquamarine"}
    else if (d === "1-2") {return "aqua"}
    else {return "lightcyan"}
}

// Labels
var leg_labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"]

// Create legend
var legend = L.control({
    position: "bottomright"
});

// Set up the legend
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend")
    // Add a title to the legend
    labels = ['<strong>Magnitude</strong>']

    // Add labels and color blocks to the legend
    for (var i = 0; i < leg_labels.length; i++) {
        div.innerHTML += 
        labels.push(
            `<span style="background:${getColor(leg_labels[i])}"></span>
        ${leg_labels[i]}`
        );
    }
    div.innerHTML = labels.join('<br>');

    return div
};

// Add legend to the map
legend.addTo(myMap);

// Grabbing Json data
d3.json(url).then((jsonData) => {
    console.log(jsonData)

    var data = jsonData.features
    console.log(data)

    // Increase the marker size
    function markerSize(mag) {
        return mag * 5000;
    }
      
    // Adding circle marker for each location
    for (var i=0; i<data.length; i++) {

        var newMarker = L.circle([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: getColor(data[i].properties.mag),
            radius: markerSize(data[i].properties.mag)
        });

        // Popup message
        newMarker.bindPopup(`<b>Magnitude: </b>${data[i].properties.mag}<hr><b>Location: </b>${data[i].properties.place}<hr><b>When: </b>${Date(data[i].properties.time)}`)
        // When hovering mouse icon over the marker, display popup message
        newMarker.on('mouseover', function (e) {
            this.openPopup()
        });
        // When no longer hovering over the icon, close the popup
        newMarker.on('mouseout', function (e) {
            this.closePopup()
        });
    
        // Add to map
        newMarker.addTo(myMap)
    }
});
