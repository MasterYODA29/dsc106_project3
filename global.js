console.log('IT’S ALIVE!');

// Get data from bisData
function getBisData(age, weight, height) {
    const key = `${age}_${weight}_${height}`;
    return bisData[key];
}

// Function to update the graph
function updateGraph() {
    const ageInput = document.getElementById('age').value;
    const weightInput = document.getElementById('weight').value;
    const heightInput = document.getElementById('height').value;

    const data = getBisData(ageInput, weightInput, heightInput);

    if (!data) {
        console.log('No data found for the given inputs');
        return;
    }

    // Clear existing SVG
    d3.select("svg").remove();

    // Set dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 50},
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Append SVG object
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the data
    data.forEach(d => {
        d.timeBin = +d.timeBin;
        d.bis = +d.bis;
    });

    // Set scales
    const x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, width]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.bis)])
                .range([height, 0]);

    // Add X axis
    const xAxis = svg.append("g")
                     .attr("transform", `translate(0,${height})`)
                     .call(d3.axisBottom(x));

    // Add Y axis
    const yAxis = svg.append("g")
                     .call(d3.axisLeft(y));

    // Add X axis label
    svg.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
       .style("text-anchor", "middle")
       .text("Time (%)");  // X axis label

    // Add Y axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -margin.left + 20)
       .attr("x", -height / 2)
       .style("text-anchor", "middle")
       .text("BIS");  // Y axis label

    // Add line
    svg.append("path")
       .datum(data)
       .attr("class", "line")
       .attr("d", d3.line()
                    .x(d => x(d.timeBin))
                    .y(d => y(d.bis))
       )
       .attr("fill", "none") // ensures no fill under
       .attr("stroke", "steelblue") // line color
       .attr("stroke-width", 2);  

    // Add points
    svg.selectAll("dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.timeBin))
       .attr("cy", d => y(d.bis))
       .attr("r", 3)
       .attr("fill", "steelblue");
}

// Attach updateGraph function to the button
document.querySelector('button').addEventListener('click', updateGraph);
