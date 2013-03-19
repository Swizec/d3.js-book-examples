
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

    var pack = d3.layout.pack()
            .padding(5)
            .size([width/1.5, height/1.5])
            .value(function (d) { return d.count; });

    var nodes = pack.nodes(tree);

    var node = svg.append('g')
            .attr('transform', 'translate(100, 100)')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('transform', function (d) { return 'translate('+d.x+', '+d.y+')'; });
    
    node.append('circle')
        .attr('r', function (d) { return d.r; })
        .attr('fill', function (d) { return helpers.color(d.nick); });

    node.call(helpers.tooltip(function (d) { return d.nick; }));

});
