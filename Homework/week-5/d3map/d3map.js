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

d3.json("datamap/data.json", function(error, data) {

var map = new Datamap({element: document.getElementById('container'),
geographyConfig: {
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
data : data.data
})
});
