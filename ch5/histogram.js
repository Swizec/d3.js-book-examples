
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});


d3.json('data/histogram-hours.json', function (data) {

    var histogram = d3.layout.histogram();

    // no, this data is a bad example, need properly raw data for this stuff

});
