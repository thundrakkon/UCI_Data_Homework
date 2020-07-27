// Set graph size
var svgWidth = 730;
var svgHeight = 500;

// Set margins
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select SVC Scatter Plot
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

// Load data from CSV file
d3.csv("./assets/data/data.csv").then(function(stateData) {
    console.log(stateData)

    var healthcare = stateData.map(data => data.healthcare)
    console.log("healthcare", healthcare)

    var poverty = stateData.map(data => data.poverty)
    console.log("poverty", poverty)

    // var smokes = stateData.map(data => data.smokes)
    // console.log("smokes", smokes)

    // var age = stateData.map(data => data.age)
    // console.log("age", age)

    var abbr = stateData.map(data => data.abbr)
    console.log("abbr", abbr)

    // Parse the data as numbers
    stateData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    })

    // Scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([4, d3.max(stateData, d => d.healthcare)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([7, d3.max(stateData, d => d.poverty)])
        .range([height, 0]);
    
    // Axix functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create circles for the scatter plot
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
            .attr("class", "stateCircle")
            .attr("cx", d => xLinearScale(d.healthcare))
            .attr("cy", d => yLinearScale(d.poverty))
            .attr("r", "14")
            .attr("opacity", "0.5");

    // Add state abbreviations inside circles
    var stateText = chartGroup.selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .text(d => d.abbr)
            .attr("x", d => xLinearScale(d.healthcare))
            .attr("y", d => yLinearScale(d.poverty))
            .attr("dy", ".35em")
            // .attr('text-anchor', 'middle')
            // .attr("font-family", "times")
            // .attr("font-size", "8px")
            // .attr("font-weight", "bold")
            // .attr("fill", "white")
            
    console.log(stateText)

    // Tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, -40])
        .style("font", "12px times")
        .style("font-weight", "bold")
        .html(d => `${d.state}<br>Healthcare: ${d.healthcare}%<br>Poverty: ${d.poverty}%`);

    // Add tooltip to chart
    chartGroup.call(toolTip)

    // Event listerns to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        })
    
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        // .style("font", "14px times")
        .style("font-weight", "bold")
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2 - 25}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        // .style("font", "14px times")
        .style("font-weight", "bold")
        .text("Lacks Healthcare (%)");
}).catch(function(error) {
    console.log(error);
});
