
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});


d3.json('data/karma_matrix.json', function (data) {

    var receivers = data.map(function (d) {
            return d.to;
        });
    
    // very much designed to work with numbers not ordinal things ...
    var histogram = d3.layout.histogram()(receivers);
    
    console.log(histogram);
});
