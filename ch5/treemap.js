
var width = 800,
    height = 800,
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
        .attr({width: function (d) { return d.dx; },
               height: function (d) { return d.dy; },
               fill: function (d) { return helpers.color(d.nick); }});

    var leaves = node.filter(function (d) { return d.depth > 1; });

    leaves.append('text')
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
 
    leaves.call(helpers.tooltip(function (d) { return d.parent.nick; }));

    leaves.on('mouseover', function (d) {
        var belongs_to = d.parent.nick;

        svg.selectAll('.node')
            .transition()
            .style('opacity', function (d) {
                if (d.depth > 1 && d.parent.nick != belongs_to) {
                    return 0.3;
                }
                if (d.depth == 1 && d.nick != belongs_to) {
                    return 0.3;
                }
                return 1;
            });
    })
        .on('mouseout', function () {
            d3.selectAll('.node')
                .transition()
                .style('opacity', 1);
        });
});
