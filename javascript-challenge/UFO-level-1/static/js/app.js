// from data.js
var tableData = data;

// Select the table body
var tbody = d3.select("tbody");

// Select the button and the form
var searchButton = d3.select("#filter-btn");
var form = d3.select("form");

// Create even handlers
searchButton.on("click", runEnter);
form.on("submit", runEnter);

// The event handler function
function runEnter() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Remove all previous table data
    d3.selectAll("tr").remove(); 
    // Select the input element
    var inputElement = d3.select("#datetime");
    // Get the value of the input element
    var inputValue = inputElement.property("value")

    // Select the filtered data equal to the input element
    var filteredData = tableData.filter(data => data.datetime === inputValue);

    // Create a table and enter the values of the filtered data
    filteredData.forEach((ufoReport) => {
        var row = tbody.append("tr");
        Object.entries(ufoReport)
            .forEach(([key, value]) => {
                var cell = row.append("td");
                cell.text(value);
        });
    });
}
