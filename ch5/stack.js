
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var bin_per_nick = function (data, nick) {
    var uniques = [];
    
    data.forEach(function (d) {
        if (uniques.indexOf(nick(d)) < 0) {
            uniques.push(nick(d));
        }
    });

    var nick_id = d3.scale.ordinal().domain(uniques).range(d3.range(uniques.length));

    var histogram = d3.layout.histogram()
            .bins(nick_id.range())
            .value(function (d) { return nick_id(nick(d)); })(data);

    return histogram;
};

d3.json('data/karma_matrix.json', function (data) {

    var time = d3.time.format('%Y-%m-%d %H:%M:%S'),
        extent = d3.extent(data.map(function (d) { return time.parse(d.time); })),
        time_bins = d3.time.days(extent[0], extent[1], 12);

    var x = d3.time.scale()
            .domain(extent)
            .range([0, width]),
        color = d3.scale.linear()
            .range(["#aad", "#556"]);

    var per_nick = bin_per_nick(data, function (d) { return d.to; });

    var time_binned  = per_nick.map(function (nick_layer) {
        return d3.layout.histogram()
            .bins(time_bins)
            .value(function (d) { return time.parse(d.time); })(nick_layer);
    });

    var layers = d3.layout.stack()
            .offset('wiggle')(time_binned);

    var y = d3.scale.linear()
            .domain([0, d3.max(layers, function (layer) {
                return d3.max(layer, function (d) { 
                    return d.y0+d.y; 
                });
            })])
            .range([height-220, 0]);

    var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function(d) { return y(d.y0)+100; })
            .y1(function(d) { return y(d.y0 + d.y)+100; });

    svg.selectAll('path')
        .data(layers)
        .enter()
        .append('path')
        .attr('d', function (d) { return area(d); })
        .style('fill', function () { return color(Math.random()); });

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

    svg.append('g')
        .attr('transform', 'translate(0, '+(height-100)+')')
        .classed('axis', true)
        .call(xAxis);

});
