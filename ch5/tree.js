
var width = 1024,
    height = 1024,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {
    
    helpers.fixate_colors(data);

    var tree = helpers.make_tree(data,
                                 function (d, nick) { return d.to == nick; },
                                 function (d, nick) { return d.from == nick; },
                                 function (d) { return d.to; },
                                 function (d) { return d[0].to; });

    var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var layout = d3.layout.tree()
            .size([360, width/2 - 120]);

    var nodes = layout.nodes(tree),
        links = layout.links(nodes);

    var chart = svg.append('g')
            .attr('transform', 'translate('+width/2+','+height/2+')');
    
    var link = chart.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);
    
    var node = chart.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
    
    node.append("circle")
        .attr("r", 4.5)
        .attr('fill', function (d) { return helpers.color(d.nick); });
    
    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.nick; })
        .style('font-size', function (d) { return d.depth > 1 ? '0.8em' : '1.1em'; });
});
