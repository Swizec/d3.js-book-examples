
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {

    var time = d3.time.format('%Y-%m-%d %H:%M:%S'),
        extent = d3.extent(data.map(function (d) { return time.parse(d.time); })),
        time_bins = d3.time.days(extent[0], extent[1], 12);

    var per_nick = helpers.bin_per_nick(data, function (d) { return d.to; });

    var time_binned  = per_nick.map(function (nick_layer) {
        return {to: nick_layer[0].to,
                values: d3.layout.histogram()
                .bins(time_bins)
                .value(function (d) { return time.parse(d.time); })(nick_layer)};
    });

    var layers = d3.layout.stack()
            .order('inside-out')
            .offset('wiggle')
            .values(function (d) { return d.values; })(time_binned);

    var margins = {
        top: 220,
        right: 50,
        bottom: 0,
        left: 50
    };

    var x = d3.time.scale()
            .domain(extent)
            .range([margins.left, width-margins.right]),
        y = d3.scale.linear()
            .domain([0, d3.max(layers, function (layer) {
                return d3.max(layer.values, function (d) { 
                    return d.y0+d.y; 
                });
            })])
            .range([height-margins.top, 0]);

    var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function(d) { return y(d.y0)+100; })
            .y1(function(d) { return y(d.y0 + d.y)+100; });

    svg.selectAll('path')
        .data(layers)
        .enter()
        .append('path')
        .attr('d', function (d) { return area(d.values); })
        .style('fill', function (d, i) { return helpers.color(i); })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    var xAxis = d3.svg.axis()
            .scale(x)
            .tickFormat(d3.time.format('%b %Y'))
            .ticks(d3.time.months, 2)
            .orient('bottom');

    svg.append('g')
        .attr('transform', 'translate(0, '+(height-100)+')')
        .classed('axis', true)
        .call(xAxis);

});

function mouseover(d) {
    var path = d3.select(this);
    path.classed('highlighted', true);
    
    var mouse = d3.mouse(svg.node());

    var tool = svg.append('g')
            .attr({'id': "nicktool",
                   transform: 'translate('+(mouse[0]+5)+', '+(mouse[1]+10)+')'});
    
    tool.append('rect')
        .attr({height: '1.25em',
               width: (d.to.length*0.75)+'em',
               transform: 'translate(0, -16)'});
    tool.append('text')
        .text(d.to);
    
}

function mousemove () {
    var mouse = d3.mouse(svg.node());
    d3.select('#nicktool')
        .attr('transform', 'translate('+(mouse[0]+15)+', '+(mouse[1]+20)+')');
}

function mouseout () {
    var path = d3.select(this);
    path.classed('highlighted', false);
    
    d3.select('#nicktool').remove();
}
