
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
            .padding(3)
            .value(function (d) { return d.count; })
            .sort(d3.ascending);

    var nodes = treemap.nodes(tree)
            .filter(function (d) { return d.depth; });

    var node = svg.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .classed('node', true)
            .attr('transform', function (d) { return 'translate('+d.x+','+d.y+')'; });

    node.append('rect')
        .attr({
               width: function (d) { return d.dx; },
               height: function (d) { return d.dy; },
               fill: function (d) { return helpers.color(d.nick); }});

    node.filter(function (d) { return d.depth > 1; })
        .append('text')
        .text(function (d) { return d.nick; })
        .attr('text-anchor', 'middle')
        .attr('transform', function (d) { 
            var box = this.getBBox(),
                transform = 'translate('+(d.dx/2)+','+(d.dy/2+box.height/2)+')';

            if (d.dx < box.width && d.dx > box.height && d.dy > box.width) {
                transform += 'rotate(-90)';
            }else if (d.dx < box.width || d.dy < box.height) {
                d3.select(this).remove();
            }

            return transform;
        });
 
    node.filter(function (d) { return d.depth > 1; })
        .call(helpers.tooltip(function (d) { return d.parent.nick; }));
});
