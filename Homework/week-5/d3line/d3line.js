// Jan Huiskes
// 10740929

// Gather the JSON data, set domain for x and y
d3.json("data.json", function(error, data) {
  if (error) throw error;
  console.log(data);
});
