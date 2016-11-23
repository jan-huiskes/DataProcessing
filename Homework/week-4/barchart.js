// Jan Huiskes
// 10740929

// Make svg tag
var svg = d3.select("body").append("svg").attr("class", "chart")

var margin = {top: 20, right: 30, bottom: 50, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    padding = 100

// Scale y
var y = d3.scale.linear()
    .range([height, margin.top / 2]);

// Scale x
var x = d3.scale.ordinal()
    .rangeRoundBands([padding / 2, width], .1);

// Make axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// d3.tip for mouse events on bars
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.mm + "</span><strong> mm</strong>";
  })

// Make space fro chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

// Gather the JSON data, set domain for x and y
d3.json("JSON/data.json", function(error, data) {
  x.domain(data.points.map(function(d) { return d.month; }));
  y.domain([0, d3.max(data.points, function(d) { return parseInt(d.mm); })]);


// Make the axes with tags
chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding / 2 + ", 0)")
    .call(yAxis);

// Make the rectangle bars with mouse events
chart.selectAll(".bar")
    .data(data.points)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.month); })
    .attr("y", function(d) { return y(d.mm); })
    .attr("height", function(d) { return height - y(d.mm); })
    .attr("width",x.rangeBand())
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

// Titles for axes and graph
svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (padding/2) +","+(height / 2)+")rotate(-90)")
    .text("Rain (mm)");

svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width/2) +","+ (height + padding / 1.8)+")")
    .text("Month");

svg.append("text")
    .attr("class", 'Title')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2 - padding / 2) +","+ padding / 1.8 +")")
    .text("Rain (in mm) by month in 2015");
});

d3.select("body").append("a").attr("href", "https://bost.ocks.org/mike/bar/3/").html("Bron")
