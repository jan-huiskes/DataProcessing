// Jan Huiskes
// 10740929

var svg = d3.select("body").append("svg").attr("class", "chart")

var margin = {top: 50, right: 30, bottom: 50, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    padding = 100

// Parse time for the dates
var parseTime = d3.timeParse("%B-%Y")

// Scale y
var yScale = d3.scaleLinear().range([height, margin.top / 2]);


// Scale x
var xScale = d3.scaleTime().range([padding/2, width]);

// Pop up
var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) { return "Date: " + d.month + "<br><br/> Temperature: " + parseInt(d.temp)/10.0 + "°C"; });
svg.call(tool_tip);

// Make space for chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Line
var line = d3.line()
    .x(function(d) { return xScale(parseTime(d.month)); })
    .y(function(d) { return yScale(parseInt(d.temp)/10.0); });

// Gather the JSON data, set domain for x and y
d3.json("data.json", function(error, data) {
  var data = data.data[0]["2014"][0].maxtemp

  xScale.domain(d3.extent(data, function(d) { return parseTime(d.month); }));
  yScale.domain([0, d3.max(data, function(d) { return parseInt(d.temp)/10.0; })]);


// Make the axes with tags
chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))

chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding / 2 + ", 0)")
    .call(d3.axisLeft(yScale));


// For cross hair
var focus = chart.append('g').style('display', 'none');

focus.append('line')
    .attr('id', 'focusLineX')
    .attr('class', 'focusLine');
focus.append('line')
    .attr('id', 'focusLineY')
    .attr('class', 'focusLine');

// Make line
chart.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)

// Make cross hair
chart.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on('mouseover', function() { focus.style('display', null); })
    .on('mouseout', function() { focus.style('display', 'none'); })
    .on('mousemove', function() {
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);

          var x = mouse[0]
          var y = mouse[1]

          focus.select('#focusLineX')
              .attr('x1', x).attr('y1', yScale(yScale.domain()[0]))
              .attr('x2', x).attr('y2', yScale(yScale.domain()[1]));
          focus.select('#focusLineY')
              .attr('x1', xScale(xScale.domain()[0])).attr('y1', y)
              .attr('x2', xScale(xScale.domain()[1])).attr('y2', y);
    });

// Make circles on data points
chart.selectAll('circle').data(data).enter().append('circle')
    .attr('cx', function(d) { return xScale(parseTime(d.month)); })
    .attr('cy', function(d) { return yScale(parseInt(d.temp)/10.0); })
    .attr('r', 5)
    .attr('class', 'circle')
    .on('mouseover', tool_tip.show)
    .on('mouseout', tool_tip.hide);

// Titles for axes and graph
svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (padding/2) +","+(height / 2)+")rotate(-90)")
    .text("Maximum temperatuur (°C)");



svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width/2) +","+ (height + padding )+")")
    .text("Month");


svg.append("text")
    .attr("class", 'Title')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2 - padding / 2) +","+ padding / 2 +")")
    .text("Maximum temperatuur (in °C) by month in 2014");
});

// Sources and whitespace
d3.select("body").append("br")
d3.select("body").append("a").attr("href", "https://www.knmi.nl/nederland-nu/klimatologie/maandgegevens").html("Bron voor data")
d3.select("body").append("br")
d3.select("body").append("p").html('Jan Huiskes 10740929')
