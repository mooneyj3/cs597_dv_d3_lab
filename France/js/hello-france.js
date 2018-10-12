const w = 600;
const h = 600;
let dataset = [];
let x, y;
let pop;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


//Create SVG element
let svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);



/*
d3.tsv("data/france.tsv")
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[0])
            console.log("Last row:", rows[rows.length - 1])
        }
    });
*/

d3.tsv("data/france.tsv")
    .row( (d, i) => {
        return {
            codePostal: +d["Postal Code"],
            inseeCode: +d.inseecode,
            place: d.place,
            longitude: +d.x,
            latitude: +d.y,
            population: +d.population,
            density: +d.density
        };
    })
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[0])
            console.log("Last row:", rows[rows.length - 1])
        }


        dataset = rows;

        x = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.longitude))
            .range([0, w]);
        y = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.latitude))
            .range([h, 0]);

        pop = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.population))
            .range([1,25]);

        draw();

    })



function draw() {
    // svg.selectAll("rect")
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        // .append("rect")
        // .attr("width", 1)
        // .attr("height", 1)
        .append("circle")
        .attr("cx", 1)
        .attr("cy", 1)
        .attr("r", (d) => pop(d.population))
        .attr("cx", (d) => x(d.longitude))
        .attr("cy", (d) => y(d.latitude))
        .style("opacity", 0.25)
        .style("fill", "#f46d43")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.latitude + ", " + d.longitude + "<br/>" + d.population)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            // div.html(formatTime(d.date) + "<br/>" + d.close)
            //     .style("left", (d3.event.pageX) + "px")
            //     .style("top", (d3.event.pageY - 28) + "px");
        })
    ;
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + h + ")")
        .call(d3.axisBottom(x));
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0, " + w + ")")
        .call(d3.axisLeft(y));
}


// circles.enter()
//     .append('circle')
//     .attr("cx", 100)
//     .attr("cy", 100)
//     .attr("r", 14);