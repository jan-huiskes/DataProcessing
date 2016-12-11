// Jan Huiskes
// 10740929
colors = ['#ffffcc',
'#fcc5c0',
'#fa9fb5',
'#f768a1',
'#dd3497',
'#ae017e',
'#7a0177'
]

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
    .rangeRoundBands([padding / 2, (width - padding * 2)], .1);
var color = d3.scale.category10();
// Make axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    // Color lines

// d3.tip for mouse events on bars
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>Percentage: " + d.per + "</span><strong>%</strong>";
  })

// Make space fro chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

// Gather the JSON data, set domain for x and y
d3.json("datapop/data.json", function(error, data) {
  var dropDown = svg.append("select")
                      .attr("name", "country-list")
                      .attr("transform", "translate(0, 0)");


  var options = dropDown.selectAll("option")
             .data(data.data)
           .enter()
             .append("option");

  options.text(function (d) { return d.country; })
        .attr("value", function (d) { return d.country; });

        function onchange() {
      	selectValue = d3.select('select').property('value')
      	d3.select('body')
      		.append('p')
      		.text(selectValue + ' is the last selected option.')
      };
  var data = data.data[0]
  var scaleDatax = ["Child (0-14)", "Adult (15+)"]
  var scaleDatay = [parseInt(data.kids), 100 - parseInt(data.kids)]
  data = [{"type" : scaleDatax[0], "per" : scaleDatay[0]},{"type" : scaleDatax[1], "per" : scaleDatay[1]}]
  x.domain(scaleDatax);
  y.domain([0, 100]);
  color.domain(scaleDatax);

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
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.type); })
    .attr("y", function(d) { return y(d.per); })
    .attr("height", function(d) { return height - y(d.per); })
    .attr("width", x.rangeBand())
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .style("fill", function(d) { return color(d.type); });

// Titles for axes and graph
svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (padding/2) +","+(height / 2)+")rotate(-90)")
    .text("Percentage (%)");

svg.append("text")
    .attr("class", 'axTitle')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width/2) +","+ (height + padding / 1.8)+")")
    .text("Person");

svg.append("text")
    .attr("class", 'Title')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2 - padding / 2) +","+ padding / 1.8 +")")
    .text("Percentage (in %) child and adult in Aruba");

});
d3.json("datamap/data.json", function(error, data) {

// make map
var map = new Datamap({element: document.getElementById('container'),
geographyConfig: {
  // pop up with name and population, if there is data, else unknown population
 popupTemplate: function(geography, data) {
string = '<div class="hoverinfo">'
string += '<strong>' + geography.properties.name + '</strong>'
string += '<br></br>'
if (data != null){
  string += 'Population: ' + data.population
}
else {
  string += 'Population: unknown'
}
string += '</div> '
   return string },
},

fills: {
  'high': colors[6], // > 10^9
  'mid5': colors[5], // > 10^8 and < 10^9
  'mid4': colors[4], // > 6*10^7  and < 10^8
  'mid3': colors[3], // > 3*10^7 and < 6*10^7
  'mid2': colors[2], // > 10^7 and < 3*10^7
  'mid1': colors[1], // > 5*10^6 and < 10^7
  'low': colors[0], // < 5*10^6
  defaultFill: '#EDDC4E'
},
// data
data : data.data,
done: function(datamap) {
       datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
           updateData(geography.id, geography.properties.name)

       });
    }
})
});

// Update data when clicked on button
function updateData(id, name){
  // Remove stuff that needs to be changed
  d3.selectAll(".Title").remove();
  d3.selectAll(".bar").remove();
  d3.selectAll("#unknown-text").remove();

  // Load data again and make everything again
  d3.json("datapop/data.json", function(error, data) {
  // check whether data should be changed to 2014 or 2015
  var data = data.data
  for (var i = 0; i < data.length; i++){
    if (data[i].country == id){
      data = data[i]
      var scaleDatax = ["Child (0-14)", "Adult (15+)"]
      var scaleDatay = [parseInt(data.kids), 100 - parseInt(data.kids)]
      datalis = [{"type" : scaleDatax[0], "per" : scaleDatay[0]},{"type" : scaleDatax[1], "per" : scaleDatay[1]}]
      // Make the rectangle bars with mouse events
      chart.selectAll(".bar")
          .data(datalis)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.type); })
          .attr("y", function(d) { return y(d.per); })
          .attr("height", function(d) { return height - y(d.per); })
          .attr("width", x.rangeBand())
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .style("fill", function(d) { return color(d.type); });
    }
  }

  if (data.length > 1){
  svg.append("text")
      .attr("id", 'unknown-text')
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (width / 2 - padding / 2) +","+ height / 2 +")")
      .text("Unkown");
    }
  svg.append("text")
      .attr("class", 'Title')
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (width / 2 - padding / 2) +","+ padding / 1.8 +")")
      .text("Percentage (in %) child and adult in " + name);
});
};
