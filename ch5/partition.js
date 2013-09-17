
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

    var partition = d3.layout.partition()
            .value(function (d) { return d.count; })
            .sort(function (a, b) {
                return d3.descending(a.count, b.count);
            })
            .size([2*Math.PI, 300]);

    var nodes = partition.nodes(tree);

    var arc = d3.svg.arc()
            .innerRadius(function (d) { return d.y; })
            .outerRadius(function (d) { return d.depth ? d.y+d.dy/d.depth : 0; });

    nodes = nodes.map(function (d) {
        d.startAngle = d.x;
        d.endAngle = d.x+d.dx;
        return d;
    });

    nodes = nodes.filter(function (d) { return d.depth; });

    var chart = svg.append('g')
            .attr('transform', 'translate('+width/2+','+height/2+')');

    var node = chart.selectAll('g')
            .data(nodes)
            .enter()
            .append('g');
    
    node.append('path')
        .attr({d: arc,
               fill: function (d) { return helpers.color(d.nick); }});
    
    node.filter(function (d) { return d.depth > 1 && d.count > 10; })
        .call(helpers.arc_labels(function (d) { return d.nick; },
                                 arc.outerRadius()));

    node.call(helpers.tooltip(function (d) { return d.nick; }));
});
