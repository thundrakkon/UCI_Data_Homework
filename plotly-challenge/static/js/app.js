// Load JSon data
d3.json("./samples.json").then((jsonData) => {
    console.log(jsonData)

    // Pull names data from JSON data
    var names = jsonData.names

    // Append dropdown list with "names
    d3.select("#selDataset")
        .selectAll("option")
        .data(names)
        .enter().append("option")
        .classed("ids", true)
        .text(function(i) {
            return i})
        .exit().remove()
});

// Option change function on change in drop down list
function optionChanged() {
    d3.json("./samples.json").then((jsonData) => {
        var dropdownMenu = d3.select("#selDataset")
        var dataset = dropdownMenu.property("value")
        // d3.event.preventDefault();

        // Pull sample & meta data
        var samples = jsonData.samples
        console.log(samples)
        
        var metadata = jsonData.metadata
        console.log(metadata)

        // Create arrays for OTU IDs and Sample Values for top 10
        var otu_ids_label = []
        var otu_ids = []
        var sample_values = []
        for(var i = 0; i < samples.length; i++){
            if(dataset == samples[i]["id"] ){
                // Get arrays for charts
                sample_values = samples[i]["sample_values"],
                otu_ids = samples[i]["otu_ids"]
                otu_labels = samples[i]["otu_labels"]
                wfreq = metadata[i]["wfreq"]
                for(var d=0; d<otu_ids.length; d++){
                    // Add "OTU" label to array values for labeling purposes
                    otu_ids_label.push("OTU " + otu_ids[d])
                }
            }
        }
        console.log(otu_ids)

        // Enter horizontal bar graph information
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids_label.slice(0,10).reverse(),
            text: otu_ids,
            type: "bar",
            orientation: "h"
        }

        // Create the data array
        var data = [trace1];

        // Add layout details
        var layout = {
            title: "Top 10 OTUs Sample Values",
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU IDs"}
        };

        // Plot the chart
        Plotly.newPlot("bar", data, layout)

        // Enter Bubble Chart information
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: otu_labels,
            marker: {
              size: sample_values,
              color: otu_ids
            }
          };
          
          var data2 = [trace2];
          
          var layout = {
            title: 'OTU ID vs Sample Values',
            showlegend: false
          };
          
          Plotly.newPlot('bubble', data2, layout);
    
        // Build the Gauge Chart

        var data3 = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: wfreq,
                title: { text: "Belly Button Washing Frequency",
                    font: { size: 24 } },
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "#EAFAF1" },
                        { range: [1, 2], color: "#D5F5E3" },
                        { range: [2, 3], color: "#ABEBC6" },
                        { range: [3, 4], color: "#82E0AA" },
                        { range: [4, 5], color: "#58D68D" },
                        { range: [5, 6], color: "#2ECC71" },
                        { range: [6, 7], color: "#28B463" },
                        { range: [7, 8], color: "#239B56" },
                        { range: [8, 9], color: "#1D8348" }
                    ]
                }
            }
          ];
          
          var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "lavender",
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot('gauge', data3, layout);

        // Loop through and add metadata information in Demographics
        for(var i = 0; i < metadata.length; i++){
            if(dataset == metadata[i]["id"] ){
                var list = d3.select("#sample-metadata")

                // Clear data
                list.html("")

                // Append data list
                list.append("li").text(`id: ${metadata[i]["id"]}`);
                list.append("li").text(`ethnicity: ${metadata[i]["ethnicity"]}`);
                list.append("li").text(`gender: ${metadata[i]["gender"]}`);
                list.append("li").text(`age: ${metadata[i]["age"]}`);
                list.append("li").text(`location: ${metadata[i]["location"]}`);
                list.append("li").text(`bbtype: ${metadata[i]["bbtype"]}`);
                list.append("li").text(`wfreq: ${metadata[i]["wfreq"]}`);
            }
        }
    })
}

// For dropdown selection, execute the following ("change")
d3.selectAll("#selDataset").on("change", optionChanged);