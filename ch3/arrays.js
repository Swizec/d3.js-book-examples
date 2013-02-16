
var width = 768,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var spiral = function (N) {
    var directions = {up: [0, -1],
                      left: [-1, 0],
                      down: [0, 1],
                      right: [1, 0]};

    var x = 0,
        y = 0,
        min = [0, 0],
        max = [0, 0],
        add = [0, 0],
        d = 0;

    var spiral = [];

    d3.range(1, N).forEach(function (i) {
        spiral.push([x, y, i]);

        add = d3.values(directions)[d];
        x += add[0], y += add[1];

        if (x < min[0]) {
            d = (d+1)%4;
            min[0] = x;
        }
        if (x > max[0]) {
            d = (d+1)%4;
            max[0] = x;
        }
        if (y < min[1]) {
            d = (d+1)%4;
            min[1] = y;
        }
        if (y > max[1]) {
            d = (d+1)%4;
            max[1] = y;
        }
    });

    return spiral;
};

var dot = d3.svg.symbol().type('circle').size(3),
    x = function (x, d) { return 300+d*x; },
    y = function (y, d) { return 300+d*y; };

d3.text('primes-to-100k.txt', function (data) {
    var primes = data.split('\n').slice(0, 15).map(Number),
        sequence = spiral(d3.max(primes)).filter(function (d) {
            return primes.indexOf(d[2]) > -1;
        });

    var a = 2;

    svg.selectAll('path')
        .data(sequence)
        .enter()
        .append('path')
        .attr('transform', function (d) { return 'translate('+x(d[0], a)+', '+y(d[1], a)+')'; })
        .attr('d', dot);

    var scale = 8;

    var regions = d3.nest()
            .key(function (d) { return Math.floor(d[0]/scale); })
            .key(function (d) { return Math.floor(d[1]/scale); })
            .rollup(function (d) { return d.length; })
            .map(sequence),
        values = d3.merge(d3.keys(regions).map(function (_x) {
            return d3.values(regions[_x]);
        }));

    var median = d3.median(values),
        shades = (d3.extent(values)[1]-d3.extent(values)[0])/2;
   
    d3.keys(regions).forEach(function (_x) {
        d3.keys(regions[_x]).forEach(function (_y) {

            var color;

            if (regions[_x][_y] > median) {
                color = d3.rgb('#496c36').brighter(regions[_x][_y]/shades);
            }else{
                color = d3.rgb('#e23c22').darker(regions[_x][_y]/shades);
            }
            
            svg.append('rect')
                .attr({x: x(_x, a*scale),
                       y: y(_y, a*scale),
                       width: a*scale,
                       height: a*scale})
                .style({fill: color,
                        'fill-opacity': 0.9});
        });
    });
});

