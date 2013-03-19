
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

    tree.children = uniques.map(
        function (nick) {
            var my_karma = data.filter(function (d) { return d.to == nick; }).length,
                given_to = helpers.bin_per_nick(
                    data.filter(function (d) { return d.from == nick; }),
                    function (d) { return d.to; }
                );

            return {nick: nick,
                    count: my_karma,
                    children: given_to.map(function (d) {
                        return {nick: d[0].to,
                                count: d.length,
                                children: []};
                    })};
    });

    uniques.forEach(function (nick) { helpers.color(nick); });

    var layout = d3.layout.tree()
            .size([360, width/2 - 120]);

    var nodes = layout.nodes(tree),
        links = layout.links(nodes);

    var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

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
