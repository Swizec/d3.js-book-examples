
var width = 1200,
    height = 450,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

svg.append('image')
    .attr({'xlink:href': 'parallax_base.png',
           width: width,
           height: height});

var screen_width = 900,
    lines = d3.range(screen_width/6),
    x = d3.scale.ordinal().domain(lines).rangeBands([0, screen_width]);

svg.append('g')
    .selectAll('line')
    .data(lines)
    .enter()
    .append('line')
    .style('shape-rendering', 'crispEdges')
    .attr({stroke: 'black',
           'stroke-width': x.rangeBand()-1,
           x1: function (d) { return x(d); },
           y1: 0,
           x2: function (d) { return x(d); },
           y2: height});

var drag = d3.behavior.drag()
        .origin(Object)
        .on('drag', function () {
            d3.select(this)
                .attr('transform', 'translate('+d3.event.x+', 0)')
                .datum({x: d3.event.x, y: 0});
        });

svg.select('g')
    .datum({x: 0, y: 0})
    .call(drag);
