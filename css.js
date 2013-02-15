
var width = 800,
    height = 600,
    margin = 20,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var x = d3.scale.linear().domain([0, 100]).range([margin, width-margin]);

var axes = [
    d3.svg.axis().scale(x),

    d3.svg.axis().scale(x)
        .ticks(5),

    d3.svg.axis().scale(x)
        .tickSubdivide(3)
        .tickSize(10, 5, 10),

    d3.svg.axis().scale(x)
        .tickValues([0, 20, 50, 70, 100])
        .tickFormat(function (d, i) {
            return ['a', 'e', 'i', 'o', 'u'][i];
        })
        .orient('top')
];

axes.forEach(function (axis, i) {
    var a = svg.append('g')
            .classed('axis', true)
            .classed('red', i%2 == 0)
            .attr('transform', 'translate(0, '+(i*50+margin)+')')
            .data(d3.range(0, 100))
            .call(axis);
});

