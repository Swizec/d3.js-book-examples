
var width = 500,
    height = 500,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {

    var uniques = helpers.uniques(data, function (d) { return d.from; }),
        nick_id = d3.scale.ordinal()
            .domain(uniques)
            .range(d3.range(uniques.length));

    var nodes = uniques.map(function (nick) {
        return {nick: nick};
    });
    var links = data.map(function (d) { 
        return {source: nick_id(d.from),
                target: nick_id(d.to)};
    });

    var force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .linkDistance(150)
            //.friction(0.1)
            .size([width, height]);

    force.start();

    var weight = d3.scale.linear()
            .domain(d3.extent(nodes.map(function (d) { return d.weight; })))
            .range([5, 30]);

    var link = svg.selectAll("line")
            .data(links)
            .enter().append("line");
    
    var node = svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr({r: function (d) { return weight(d.weight); },
                   fill: function (d) { return helpers.color(d.index); }})
            .call(force.drag);

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
});
