
var width = 800,
    height = 800,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {

    var uniques = helpers.uniques(data, function (d) { return d.from; }),
        nick_id = d3.scale.ordinal()
            .domain(uniques)
            .range(d3.range(uniques.length));

    var matrix = d3.range(uniques.length).map(function () {
        return d3.range(uniques.length).map(function () { return 0; });
    });
    data.forEach(function (d) {
        matrix[nick_id(d.from)][nick_id(d.to)] += 1;
    });

    var nodes = uniques.map(function (nick) {
        return {nick: nick};
    });
    var links = data.map(function (d) {
        return {source: nick_id(d.from),
                target: nick_id(d.to),
                count: matrix[nick_id(d.from)][nick_id(d.to)]};
    });

    var force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .gravity(0.5)
            .size([width, height]);

    force.start();

     var weight = d3.scale.linear()
            .domain(d3.extent(nodes.map(function (d) { return d.weight; })))
            .range([5, 30]),
         strength = d3.scale.linear()
             .domain(d3.extent(d3.merge(matrix)))
             .range([0, 1]),
         distance = d3.scale.linear()
             .domain(d3.extent(d3.merge(matrix)))
             .range([250, 100]),
         given = d3.scale.linear()
             .range([2, 35]);

    force.charge(function (d) {
        return -weight(d.weight);
    })
        .linkStrength(function (d) {
            return strength(d.count);
        })
        .linkDistance(function (d) {
            return distance(d.count);
        });

    force.start();

    var link = svg.selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr('class', function (d) { return 'nick_'+nick_id(d.source.nick); })
            .classed('link', true);
    
    var node = svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr('class', function (d) { return 'nick_'+nick_id(d.nick); })
            .classed('node', true)
            .attr({r: function (d) { return weight(d.weight); },
                   fill: function (d) { return helpers.color(d.index); }})
            .on('mouseover', function (d) {
                var mouse = d3.mouse(svg.node());
                
                svg.append('text')
                    .text(d.nick)
                    .attr({id: "nicktool",
                           transform: 'translate('+(mouse[0]+5)+', '+(mouse[1]+10)+')'});
     
                given.domain(d3.extent(matrix[nick_id(d.nick)]));

                uniques.map(function (nick) {
                    var count = matrix[nick_id(d.nick)][nick_id(nick)];

                    if (nick != d.nick) {
                        d3.selectAll('circle.nick_'+nick_id(nick))
                            .classed('unconnected', true)
                            .transition()
                            .attr('r', given(count));
                    }
                });
            })
            .on('mousemove', function () {
                var mouse = d3.mouse(svg.node());
                d3.select('#nicktool')
                    .attr('transform', 'translate('+(mouse[0]+15)+', '+(mouse[1]+20)+')');
            })
            .on('mouseout', function (d) {
                var path = d3.select(this);
                path.style('fill-opacity', 1);
                path.style({stroke: 'none'});
                
                d3.select('#nicktool').remove();

                d3.selectAll('.unconnected')
                    .classed('unconnected', false)
                    .transition()
                    .attr('r', function (d) { return weight(d.weight); });
            })
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
