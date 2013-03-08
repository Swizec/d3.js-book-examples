
var width = 600,
    height = 600,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var position = function (t) {
    //var a = 80, b = 1, c = 1, d = 80;
    var a = 9, b = 100, c = 200, d = 9;

    return {x: Math.cos(a*t) - Math.pow(Math.cos(b*t), 3),
            y: Math.sin(c*t) - Math.pow(Math.sin(d*t), 4)};
};

var t_scale = d3.scale.linear().domain([500, 60000]).range([0, 2*Math.PI]),
    x = d3.scale.linear().domain([-2, 2]).range([100, width-100]),
    y = d3.scale.linear().domain([-2, 2]).range([height-100, 100]);

var brush = svg.append('circle')
        .attr({r: 4}),
    previous = position(0);

var step = function (time) {
    if (time > t_scale.domain()[1]) {
        return true;
    }
    
    var t = t_scale(time),
        pos = position(t);

    brush.attr({cx: x(pos.x),
                cy: y(pos.y)});
    svg.append('line')
        .attr({x1: x(previous.x),
               y1: y(previous.y),
               x2: x(pos.x),
               y2: y(pos.y),
               stroke: 'steelblue',
               'stroke-width': 1.3});

    previous = pos;
};

var timer = d3.timer(step, 500);
