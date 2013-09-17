
var width = 768,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var spiral = function (n) {
    var directions = {up: [0, -1],
                      left: [-1, 0],
                      down: [0, 1],
                      right: [1, 0]};

    var x = 0,
        y = 0,
        min = [0, 0],
        max = [0, 0],
        add = [0, 0],
        direction = 0;

    var spiral = [];

    d3.range(1, n).forEach(function (i) {
        spiral.push({x: x, y: y, n: i});

        add = directions[['up', 'left', 'down', 'right'][direction]];
        x += add[0], y += add[1];

        if (x < min[0]) {
            direction = (direction+1)%4;
            min[0] = x;
        }
        if (x > max[0]) {
            direction = (direction+1)%4;
            max[0] = x;
        }
        if (y < min[1]) {
            direction = (direction+1)%4;
            min[1] = y;
        }
        if (y > max[1]) {
            direction = (direction+1)%4;
            max[1] = y;
        }
    });

    return spiral;
};

var dot = d3.svg.symbol().type('circle').size(3),
    center = 400,
    x = function (x, l) { return center+l*x; },
    y = function (y, l) { return center+l*y; };

d3.text('primes-to-100k.txt', function (data) {

    var primes = data.split('\n').slice(0, 5000).map(Number),
        sequence = spiral(d3.max(primes)).filter(function (d) {
            return _.indexOf(primes, d['n'], true) > -1;
        });

    var l = 2;

    svg.selectAll('path')
        .data(sequence)
        .enter()
        .append('path')
        .attr('transform', function (d) { return 'translate('+x(d['x'], l)+', '+y(d['y'], l)+')'; })
        .attr('d', dot);

    var scale = 8;

    var regions = d3.nest()
            .key(function (d) { return Math.floor(d['x']/scale); })
            .key(function (d) { return Math.floor(d['y']/scale); })
            .rollup(function (d) { return d.length; })
            .map(sequence),
        values = d3.merge(d3.keys(regions).map(function (_x) {
            return d3.values(regions[_x]);
        }));

    var median = d3.median(values),
        extent = d3.extent(values),
        shades = (extent[1]-extent[0])/2;

    d3.keys(regions).forEach(function (_x) {
        d3.keys(regions[_x]).forEach(function (_y) {

            var color,
                red = '#e23c22',
                green = '#496c36';

            if (regions[_x][_y] > median) {
                color = d3.rgb(green).brighter(regions[_x][_y]/shades);
            }else{
                color = d3.rgb(red).darker(regions[_x][_y]/shades);
            }

            svg.append('rect')
                .attr({x: x(_x, l*scale),
                       y: y(_y, l*scale),
                       width: l*scale,
                       height: l*scale})
                .style({fill: color,
                       'fill-opacity': 0.9});
        });
    });
});
