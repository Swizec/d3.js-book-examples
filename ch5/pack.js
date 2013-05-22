
var width = 1024,
    height = 1024,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {

    var tree = helpers.make_tree(data,
                                 function (d, nick) { return d.to == nick; },
                                 function (d, nick) { return d.to == nick; },
                                 function (d) { return d.from; },
                                 function (d) { return d[0].from; });
    helpers.fixate_colors(data);

    var pack = d3.layout.pack()
            .padding(5)
            .size([width/1.5, height/1.5])
            .value(function (d) { return d.count; });

    var nodes = pack.nodes(tree);

    svg.append('g')
        .attr('transform', 'translate(100, 100)')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('circle')
        .attr({r: function (d) { return d.r; },
               cx: function (d) { return d.x; },
               cy: function (d) { return d.y; }})
        .attr('fill', function (d) { return helpers.color(d.nick); })
        .call(helpers.tooltip(function (d) { return d.nick; }));
});
