
var width = 1024,
    height = 1024,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {
    
    var tree = {nick: 'karma',
                children: []};
    var uniques = helpers.uniques(data, function (d) { return d.from; });

    tree.children = uniques.map(function (nick) {
        return {nick: nick,
                count: data.filter(function (d) { return d.to == nick; }).length,
                children: helpers.bin_per_nick(
                    data.filter(function (d) { return d.to == nick; }),
                    function (d) { return d.from; }
                ).map(function (d) {
                        return {nick: d[0].from,
                                count: d.length,
                                children: []};
                    })};
    });

    uniques.forEach(function (nick) { helpers.color(nick); });

    var partition = d3.layout.partition()
            .value(function (d) { return d.count; })
            .sort(function (a, b) {
                return d3.descending(a.count, b.count);
            })
            .size([2*Math.PI, 300]);

    var nodes = partition.nodes(tree),
        links = partition.links(nodes);

    var radius = d3.scale.linear()
            .domain([100, d3.max(nodes, function (d) { return d.y+d.dy; })])
            .range([100, 300]);

    var arc = d3.svg.arc()
            .innerRadius(function (d) { return radius(d.y); })
            .outerRadius(function (d) { return d.depth ? radius(d.y+d.dy/d.depth) : 0; });

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
               fill: function (d) { return d.depth ? helpers.color(d.nick) : 'white'; }});
    
    helpers.arc_labels(node.filter(function (d) { return d.depth > 1; }),
                       function (d) { return d.nick; },
                       arc.outerRadius());

});
