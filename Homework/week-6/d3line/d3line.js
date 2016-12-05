// Jan Huiskes
// 10740929

d3.json("data.json", function(error, data) {
console.log(data.data[0]["2014"][0].maxtemp)
})

var svg = d3.select("body").append("svg").attr("class", "chart")

var margin = {top: 20, right: 30, bottom: 50, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    padding = 100

var parseTime = d3.timeParse("%B-%Y")

// Scale y
var y = d3.scaleLinear().range([height, margin.top / 2]);


// Scale x
var x = d3.scaleTime().range([padding/2, width]);



// d3.tip for mouse events on bars
// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return "<span>" + d.mm + "</span><strong> mm</strong>";
//   })

// Make space fro chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.call(tip);
var line = d3.line()
    .x(function(d) { return x(parseTime(d.month)); })
    .y(function(d) { return y(parseInt(d.temp)/10.0); });

// Gather the JSON data, set domain for x and y
d3.json("data.json", function(error, data) {
  x.domain(d3.extent(data.data[0]["2014"][0].maxtemp, function(d) { return parseTime(d.month); }));
  y.domain([0, d3.max(data.data[0]["2014"][0].maxtemp, function(d) { return parseInt(d.temp)/10.0; })]);


// Make the axes with tags
chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding / 2 + ", 0)")
    .call(d3.axisLeft(y));


// Make the rectangle bars with mouse events
chart.append("path")
    .data([data.data[0]["2014"][0].maxtemp])
    .attr("class", "line")
    .attr("d", line)
    // .attr("x", function(d) { return x(d.month); })
    // .attr("y", function(d) { return y(parseInt(d.temp)/10.0); })
    // .attr("height", function(d) { return height - y(parseInt(d.temp)/10.0); })
    // .attr("width",x.rangeBand())
    // .on('mouseover', tip.show)
    // .on('mouseout', tip.hide);

// Titles for axes and graph
svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (padding/2) +","+(height / 2)+")rotate(-90)")
    .text("Maximum temperatuur (°C)");



svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width/2) +","+ (height + padding / 1.8)+")")
    .text("Month");


svg.append("text")
    .attr("class", 'Title')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2 - padding / 2) +","+ padding / 4 +")")
    .text("Maximum temperatuur (in °C) by month in 2014");
});

// Sources and whitespace
d3.select("body").append("br")
d3.select("body").append("a").attr("href", "https://www.knmi.nl/nederland-nu/klimatologie/maandgegevens").html("Bron voor data")
d3.select("body").append("br")
d3.select("body").append("p").html('Jan Huiskes 10740929')
