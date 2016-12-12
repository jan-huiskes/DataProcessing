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

// Color bars
var color = d3.scale.category10();

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
    return "<span>Percentage: " + d.per + "</span><strong>%</strong>";
  })

// Make space fro chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

// Load 2 datasets for first barchart
queue()
	.defer(d3.json, 'dataKid/kid.json')
	.defer(d3.json, 'dataAdult/adult.json')
	.await(makeMyBarchart);


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

// Gather the JSON datas for first barchart
function makeMyBarchart(error, kid, adult) {

  // Make drop down menu with the right options
  var dropDown = d3.select("body").append("div")
                      .attr("class", "drop")
                      .append("select").on("change", function() {updateData(this.value)})
                      .attr("name", "country-list")


  var options = dropDown.selectAll("option")
             .data(kid.data)
           .enter()
             .append("option");

  options.text(function (d) { return d.country + " (" + d.id + ")"; })
        .attr("value", function (d) { return d.id ; })

  // Make the x and y data for barchart
  var scaleDatax = ["Child (0-14)", "Adult (15-65)", "Senior (65+)"]
  var scaleDatay = [parseInt(kid.data[0].kids), parseInt(adult.data[0].adult), 100 - parseInt(kid.data[0].kids) - parseInt(adult.data[0].adult)]
  var data = [{"type" : scaleDatax[0], "per" : scaleDatay[0]},{"type" : scaleDatax[1], "per" : scaleDatay[1]},{"type" : scaleDatax[2], "per" : scaleDatay[2]}]
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
    .attr("x", function(d) { return x(d.type); })
    .attr("y", function(d) { return y(d.per); })
    .attr("height", function(d) { return height - y(d.per); })
    .attr("width", x.rangeBand())
    .attr("class", "bar")
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
    .attr("transform", "translate("+ (width/2 - padding /2) +","+ (height + padding / 1.8)+")")
    .text("Demographic group");

svg.append("text")
    .attr("class", 'Title')
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2) +","+ padding / 5 +")")
    .text("Percentage (in %) of demographic groups in Aruba");


// Sources and whitespace
d3.select("body").append("br")
d3.select("body").append("a").attr("href", "http://data.worldbank.org/indicator/SP.POP.TOTL").html("Bron voor data")
d3.select("body").append("br")
d3.select("body").append("p").html('Jan Huiskes 10740929');


};

// When clicked or chosen from drop down menu, change barchart
function updateData(id, name) {

  // Load again
  queue()
  	.defer(d3.json, 'dataKid/kid.json')
  	.defer(d3.json, 'dataAdult/adult.json')
  	.await(makeMyBarchart2);


// Update data to the right data from that country
function makeMyBarchart2(error, kid, adult){

  // Remove stuff that needs to be changed
  d3.selectAll(".Title").remove();
  d3.selectAll(".bar").remove();
  d3.selectAll("#unknown-text").remove();

  // If not any data found from that country, it stays true
  var bool = true

  // Find the corresponding data sets
  for (var i = 0; i < kid.data.length; i++){
    if (kid.data[i].id == id){
      for (var j = 0; j < adult.data.length; j++){
        if (adult.data[j].id == id){

      name = kid.data[i].country

      // Scale data again
      var scaleDatax = ["Child (0-14)", "Adult (15-65)", "Senior (65+)"]
      var scaleDatay = [parseInt(kid.data[i].kids), parseInt(adult.data[j].adult), 100 - parseInt(kid.data[i].kids) - parseInt(adult.data[j].adult)]
      var data = [{"type" : scaleDatax[0], "per" : scaleDatay[0]},{"type" : scaleDatax[1], "per" : scaleDatay[1]},{"type" : scaleDatax[2], "per" : scaleDatay[2]}]

      bool = false

      // Make the rectangle bars with mouse events and fading
      var bar = chart.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.type); })
          .attr("y", function(d) { return y(d.per); })
          .attr("height", function(d) { return height - y(d.per); })
          .attr("width", x.rangeBand())
          .attr("opacity", 0)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .style("fill", function(d) { return color(d.type); });

      bar.transition().duration(2000).attr("opacity", 1)
    }
  }}};

  // Display unknown if no data of that country with fading
  if (bool){
  var text = svg.append("text")
      .attr("id", 'unknown-text')
      .attr("text-anchor", "middle")
      .attr("opacity", 0)
      .attr("transform", "translate("+ (width / 2 - padding / 2) +","+ height / 2 +")")
      .text("Unknown");

      text.transition().duration(2000).attr("opacity", 1)
    }

  // Change title with fading
  var title = svg.append("text")
      .attr("class", 'Title')
      .attr("text-anchor", "middle")
      .attr("opacity", 0)
      .attr("transform", "translate("+ (width / 2) +","+ padding / 5 +")")
      .text("Percentage (in %) of demographic groups in " + name);

      title.transition().duration(2000).attr("opacity", 1)
};
};
