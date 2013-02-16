
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

var dot = d3.svg.symbol().type('circle').size(2),
    d = 2,
    x = function (x) { return 200+d*x; },
    y = function (y) { return 200+d*y; };

d3.text('primes-to-100k.txt', function (data) {
    var primes = data.split('\n').slice(0, 4000).map(Number),
        sequence = spiral(d3.max(primes));

    svg.selectAll('path')
        .data(sequence.filter(function (d) {
            return primes.indexOf(d[2]) > -1;
        }))
        .enter()
        .append('path')
        .attr('transform', function (d) { return 'translate('+x(d[0])+', '+y(d[1])+')'; })
        .attr('d', dot);

});
