
var width = 800,
    height = 600,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var weierstrass = function (x) {
    var a = 0.5,
        b = (1+3*Math.PI/2)/a;

    return d3.sum(d3.range(100).map(function (n) {
        return Math.pow(a, n)*Math.cos(Math.pow(b, n)*Math.PI*x);
    }));
};

var draw_one = function (line) {
    return svg.append('path')
        .datum(data)
        .attr("d", line)
        .style({'stroke-width': 2, 
                fill: 'none'});
};

var data = d3.range(-100, 100).map(function (d) { return d/200; }),
    extent = d3.extent(data.map(weierstrass)),
    colors = d3.scale.category10(),
    x = d3.scale.linear().domain(d3.extent(data)).range([0, width]);



var linear = d3.scale.linear().domain(extent).range([height/4, 0]),
    line1 = d3.svg.line()
        .x(x)
        .y(function(d) { return linear(weierstrass(d)); });

draw_one(line1)
    .attr('transform', 'translate(0, '+(height/16)+')')
    .style('stroke', colors(0));


var identity = d3.scale.identity().domain(extent),
    line2 = line1.y(function (d) { return identity(weierstrass(d)); });

draw_one(line2)
    .attr('transform', 'translate(0, '+(height/12)+')')
    .style('stroke', colors(1));

var power = d3.scale.pow().exponent(0.2).domain(extent).range([height/2, 0]),
    line3 = line1.y(function (d) { return power(weierstrass(d)); });

draw_one(line3)
    .attr('transform', 'translate(0, '+(height/8)+')')
    .style('stroke', colors(2));


var log = d3.scale.log().domain(d3.extent(data.filter(function (d) { return d > 0 ? d : 0; }))).range([0, width]),
    line4 = line1.x(function (d) { return d > 0 ? log(d) : 0; })
        .y(function (d) { return linear(weierstrass(d)); });

draw_one(line4)
    .attr('transform', 'translate(0, '+(height/4)+')')
    .style('stroke', colors(3));


var quantize = d3.scale.quantize().domain(extent).range(d3.range(-1, 2, 0.5).map(function (d) { return d*100; })),
    line5 = line1.x(x).y(function (d) { return quantize(weierstrass(d)); }),
    offset = 100;

draw_one(line5)
    .attr('transform', 'translate(0, '+(height/2+offset)+')')
    .style('stroke', colors(4));


var threshold = d3.scale.threshold().domain([-1, 0, 1]).range([-50, 0, 50, 100]),
    line6 = line1.x(x).y(function (d) { return threshold(weierstrass(d)); });

draw_one(line6)
    .attr('transform', 'translate(0, '+(height/2+offset*2)+')')
    .style('stroke', colors(5));
