
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var t_scale = d3.scale.linear().domain([500, 2000]).range([0, Math.PI*2]),
    x = d3.scale.linear().domain([-2, 2]).range([100, width-100]),
    y = d3.scale.linear().domain([-2, 2]).range([500, 100]);
    //ball = svg.append('circle')
    //    .attr({'r': 2});

var thing = function (time) {
    if (time > 2000) {
        return true;
    }
    
    var t = t_scale(time);

    var cx = Math.cos(1*t) - Math.pow(Math.cos(7*t), 3),
        cy = Math.sin(1*t) - Math.pow(Math.sin(7*t), 3);

    svg.append('circle').attr({cx: x(cx),
                               cy: y(cy),
                               r: 2});
};

var timer = d3.timer(thing, 500);
