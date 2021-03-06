// Jan Huiskes
// 10740929

var svg = d3.select("body").append("svg").attr("class", "chart")

var margin = {top: 50, right: 100, bottom: 120, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;
    padding = 100

var parseTime = d3.timeParse("%B-%Y")

// Scale x
var xScale = d3.scaleTime().range([padding/2, width]);

// Scale y
var yScale = d3.scaleLinear().range([height, margin.top / 2]);

// Color lines
var color = d3.scaleOrdinal(d3.schemeCategory10);

// check for which year the graph is
var check = 0

// Make a button with text to change between the year 2014-2015
var button = svg.append('g')
  .append('rect')
    .attr('class', 'button')
    .attr("width", 100)
    .attr("height", 30)
    .attr('transform', 'translate(' + width / 2 + ',' + (height  + margin.bottom) + ')')
    .on('click', function(){updateData()})

svg.append('text')
    .attr('id', 'text-button')
    .attr("text-anchor", "middle")
    .attr('transform', 'translate('  + (width / 2 + margin.left + 10) + ',' + (height  + margin.bottom + 20) + ')')
    .text('Update to 2015')

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

    // Make cross hair
    var focus = chart.append('g').style('display', 'none');

    focus.append('line')
        .attr('id', 'focusLineX')
        .attr('class', 'focusLine');
    focus.append('line')
        .attr('id', 'focusLineY')
        .attr('class', 'focusLine');


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
// Line
var line = d3.line()
    .x(function(d) { return xScale(parseTime(d.month)); })
    .y(function(d) { return yScale(parseInt(d.temp)/10.0); });

// Gather the JSON data, set domain for x and y
d3.json("data.json", function(error, data) {
  var data1 = data.data[0]["2014"]

  var scaleData = data1[0].values

  xScale.domain(d3.extent(scaleData, function(d) { return parseTime(d.month); }));
  yScale.domain([0, d3.max(scaleData, function(d) { return parseInt(d.temp)/10.0; })]);

   color.domain(data1.map(function(d) { return d.kind; }));

// Make the axes with tags
chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))

chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding / 2 + ", 0)")
    .call(d3.axisLeft(yScale));


// Make the three different lins and circles
for (var i = 0; i < data1.length; i++) {
data2 = data1[i].values

chart.append("path")
    .data([data2])
    .attr("class", "line")
    .attr("d", line)
    .style("stroke",  color(data1[i].kind)) ;

chart.append("text")
    .data([data2])
    .attr("id", "line-text")
    .attr("transform", function(d) { return "translate(" + (xScale(parseTime(d[11].month)) + 10) + "," + yScale(parseInt(d[11].temp)/10.0) + ")"; })
    .attr("x", 3)
    .attr("dy", "0.35em")
    .style("font", "12px sans-serif")
    .text("" + data1[i].kind + "");

    for (var j = 0; j < data2.length; j++){
      data = data2[j]
      chart.append('circle')
        .data([data])
        .attr('cx', function(d) { return xScale(parseTime(d.month)); })
        .attr('cy', function(d) { return yScale(parseInt(d.temp)/10.0); })
        .attr('r', 5)
        .attr('class', 'circle')
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
        .style("stroke",  color(data1[i].kind)) ;
  }
}
});

// Titles for axes and graph
svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (padding/2) +","+(height / 2)+")rotate(-90)")
    .text("Temperatuur (°C)");

svg.append("text")
    .attr("class", 'Title')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2 + padding/2) +","+ padding / 2 +")")
    .text("Maximum, minimum and average temperatuur (in °C) by month in 2014");

svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width/2 + padding/2) +","+ (height + padding )+")")
    .text("Month");

// Sources and whitespace
d3.select("body").append("br")
d3.select("body").append("a").attr("href", "https://www.knmi.nl/nederland-nu/klimatologie/maandgegevens").html("Bron voor data")
d3.select("body").append("br")
d3.select("body").append("p").html('Jan Huiskes 10740929');


// Update data when clicked on button
function updateData(){
  // Remove stuff that needs to be changed
  d3.selectAll(".Title").remove();
  d3.selectAll(".axis").remove();
  d3.selectAll("path").remove();
  d3.selectAll("circle").remove();
  d3.selectAll("#line-text").remove();
  d3.selectAll("#text-button").remove();


  // Load data again and make everything again
  d3.json("data.json", function(error, data) {
  // check whether data should be changed to 2014 or 2015
  if (check == 0){
    var data1 = data.data[0]["2015"]
    check++
  }
  else{
    var data1 = data.data[0]["2014"]
    check--
  }

  // Button text display
  if (check == 0){
    var buttext = 'Update to 2015'
  }
  else{
    var buttext = 'Update to 2014'
  }

  svg.append('text')
      .attr('id', 'text-button')
      .attr("text-anchor", "middle")
      .attr('transform', 'translate('  + (width / 2 + margin.left + 10) + ',' + (height  + margin.bottom + 20) + ')')
      .text(buttext)

  var scaleData = data1[0].values

  // Only change x-as
  xScale.domain(d3.extent(scaleData, function(d) { return parseTime(d.month); }));


  // Make the axes with tags
  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))

  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding / 2 + ", 0)")
    .call(d3.axisLeft(yScale));

  // Title check
  if (check == 1){
    svg.append("text")
      .attr("class", 'Title')
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (width / 2 + padding/2) +","+ padding / 2 +")")
      .text("Maximum, minimum and average temperatuur (in °C) by month in 2015");
    }

    if (check == 0){
      svg.append("text")
        .attr("class", 'Title')
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width / 2 + padding/2) +","+ padding / 2 +")")
        .text("Maximum, minimum and average temperatuur (in °C) by month in 2014");
      }


  // Make the three different lines and circles
  for (var i = 0; i < data1.length; i++) {
  data2 = data1[i].values

  chart.append("path")
    .data([data2])
    .attr("class", "line")
    .attr("d", line)
    .style("stroke",  color(data1[i].kind)) ;

  chart.append("text")
    .data([data2])
    .attr("id", "line-text")
    .attr("transform", function(d) { return "translate(" + (xScale(parseTime(d[11].month)) + 10) + "," + yScale(parseInt(d[11].temp)/10.0) + ")"; })
    .attr("x", 3)
    .attr("dy", "0.35em")
    .style("font", "12px sans-serif")
    .text("" + data1[i].kind + "");

    for (var j = 0; j < data2.length; j++){
      data = data2[j]
      chart.append('circle')
        .data([data])
        .attr('cx', function(d) { return xScale(parseTime(d.month)); })
        .attr('cy', function(d) { return yScale(parseInt(d.temp)/10.0); })
        .attr('r', 5)
        .attr('class', 'circle')
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
        .style("stroke",  color(data1[i].kind)) ;
  }
  }
  })
};
