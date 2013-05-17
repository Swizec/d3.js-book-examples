
var width = 1024,
    height = 2800,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {

    var tree = helpers.make_tree(data,
                                 function (d, nick) { return d.to == nick; },
                                 function (d, nick) { return d.from == nick; },
                                 function (d) { return d.to; },
                                 function (d) { return d[0].to; });

    helpers.fixate_colors(data);

    var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

    var cluster = d3.layout.cluster()
            .size([height, width-150])
            .sort(function (a, b) { return d3.descending(a.count, b.count); });

    var nodes = cluster.nodes(tree),
        links = cluster.links(nodes);

    svg.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .classed('link', true)
        .attr('d', diagonal);

    var node = svg.selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .classed('node', true)
            .attr('transform', function (d) { return 'translate('+d.y+', '+d.x+')'; });

    node.append('circle')
        .attr({r: 5,
               fill: function (d) { return helpers.color(d.nick); }});

    node.append('text')
        .text(function (d) { return d.nick; })
        .attr("dx", function(d) { return d.children.length ? -8 : 8; })
        .attr("dy", function (d) { return d.depth > 1 ? 3 : 5; })
        .attr("text-anchor", function(d) { return d.children.length ? "end" : "start"; })
        .style('font-size', function (d) { return d.depth > 1 ? '0.8em' : '1.1em'; });
});
