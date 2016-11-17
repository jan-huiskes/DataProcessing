/* Jan Huiskes 10740929 */


/* use this to test out your function */
window.onload = function() {
  changeColor('gb', '#ff00ff');
  changeColor('ita', '#ffcc00');
  changeColor('swe', '#003366');
  changeColor('nlx', '#6600ff');
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    document.getElementById(id).style.fill=color;
}
