console.log('IT’S ALIVE!');

// Get data from bisData
function getBisData(age, weight, height) {
    let age_range = "";
    let weight_range = "";
    let height_range = "";

    // find age range
    if (age >= 20 && age <= 29) {
        age_range = "20-29";
    } else if (age >= 30 && age <= 39) {
        age_range = "30-39";
    } else if (age >= 40 && age <= 49) {
        age_range = "40-49";
    } else if (age >= 50 && age <= 59) {
        age_range = "50-59";
    } else if (age >= 60 && age <= 69) {
        age_range = "60-69";
    } else if (age >= 70 && age <= 79) {
        age_range = "70-79";
    } else {
        console.log('Age out of range');
    }
    
    // find weight range
    if (weight >= 45 && weight <= 59) {
        weight_range = "45-59";
    } else if (weight >= 60 && weight <= 74) {
        weight_range = "60-74";
    } else if (weight >= 75 && weight <= 89) {
        weight_range = "75-89";
    } else {
        console.log('Weight out of range');
    }

    // find height range
    if (height >= 150 && height <= 159) {
        height_range = "150-159";
    } else if (height >= 160 && height <= 169) {
        height_range = "160-169";
    } else if (height >= 170 && height <= 179) {
        height_range = "170-179";
    } else {
        console.log('Height out of range');
    }

    const key = `${age_range}_${weight_range}_${height_range}`;
    return bisData[key];
}

// Function to update the graph
function updateGraph() {
    const ageInput = document.getElementById('age').value;
    const weightInput = document.getElementById('weight').value;
    const heightInput = document.getElementById('height').value;

    // Update the value labels
    document.getElementById('ageValue').textContent = ageInput;
    document.getElementById('weightValue').textContent = weightInput;
    document.getElementById('heightValue').textContent = heightInput;

    const data = getBisData(ageInput, weightInput, heightInput);

    if (!data) {
        console.log('No data found for the given inputs');
        return;
    }

    // Clear existing SVG
    d3.select("svg").remove();

    // Set dimensions and margins
    const margin = {top: 20, right: 30, bottom: 50, left: 50},
          width = 900 - margin.left - margin.right,
          height = 450 - margin.top - margin.bottom;

    // Append SVG object
    const svg = d3.select("#line-chart")
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

    // Add x-axis
    const xAxis = svg.append("g")
                     .attr("transform", `translate(0,${height})`)
                     .call(d3.axisBottom(x));

    // Add y-axis
    const yAxis = svg.append("g")
                     .call(d3.axisLeft(y));

    // Add x-axis label
    svg.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
       .style("text-anchor", "middle")
       .text("Time (% of surgery)");  // x-axis label

    // Add y-axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -margin.left + 20)
       .attr("x", -height / 2)
       .style("text-anchor", "middle")
       .text("BIS (alertness)");  // y-axis label

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

    // Add points/tooltips
    const tooltip = d3.select("#tooltip");
    svg.selectAll("circle")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.timeBin))
       .attr("cy", d => y(d.bis))
       .attr("r", 3)
       .attr("fill", "steelblue")
       .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "orange").attr("r", 6); //enelarge/recolor on hover
        tooltip.transition()
               .duration(200)
               .style("opacity", .9);
        tooltip.html(`Time: ${d.timeBin}<br>BIS: ${d.bis.toFixed(2)}`)
               .style("left", (event.pageX + 5) + "px")
               .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
        d3.select(this).attr("fill", "steelblue").attr("r", 3); //reset to original size and color
        tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    });
       
}

document.getElementById('age').addEventListener('input', updateGraph);
document.getElementById('weight').addEventListener('input', updateGraph);
document.getElementById('height').addEventListener('input', updateGraph);

// Initial graph update on page load
updateGraph();