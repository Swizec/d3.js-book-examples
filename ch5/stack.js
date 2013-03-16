
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

    var x = d3.time.scale()
            .domain(extent)
            .range([50, width-50]),
        color = d3.scale.linear()
            .range(["#aad", "#556"]);

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

    var y = d3.scale.linear()
            .domain([0, d3.max(layers, function (layer) {
                return d3.max(layer.values, function (d) { 
                    return d.y0+d.y; 
                });
            })])
            .range([height-220, 0]);

    var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function(d) { return y(d.y0)+100; })
            .y1(function(d) { return y(d.y0 + d.y)+100; });

    var layer = svg.selectAll('path')
            .data(layers)
            .enter()
            .append('path')
            .attr('d', function (d) { return area(d.values); })
            .style('fill', function () { return color(Math.random()); })
            .on('mouseover', function (d) {
                var path = d3.select(this);
                path.style('fill-opacity', 0.5);
                path.style({stroke: 'red', 
                            'stroke-width': 1.5});
                
                var mouse = d3.mouse(svg.node());
                
                svg.append('text')
                    .text(d.to)
                    .attr({id: "nicktool",
                           transform: 'translate('+(mouse[0]+5)+', '+(mouse[1]+10)+')'});
            })
            .on('mousemove', function () {
                var mouse = d3.mouse(svg.node());
                d3.select('#nicktool')
                    .attr('transform', 'translate('+(mouse[0]+15)+', '+(mouse[1]+20)+')');
            })
            .on('mouseout', function () {
                var path = d3.select(this);
                path.style('fill-opacity', 1);
                path.style({stroke: 'none'});
                
                d3.select('#nicktool').remove();
            });
    
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
