
var width = 800,
    height = 800,
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
 
    var treemap = d3.layout.treemap()
            .size([width, height])
            .padding(2)
            .value(function (d) { return d.count; })
            .sort(d3.ascending);

    var nodes = treemap.nodes(tree);

    svg.selectAll('rect')
        .data(nodes)
        .enter()
        .append('rect')
        .attr({x: function (d) { return d.x; },
               y: function (d) { return d.y; },
               width: function (d) { return d.dx; },
               height: function (d) { return d.dy; },
               fill: function (d) { return helpers.color(d.nick); }});
});
