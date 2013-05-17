
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {

    var filtered = data.filter(function (d) { return d.to == 'HairyFotr'; });

    var per_nick = helpers.bin_per_nick(filtered, function (d) { return d.from; });

    var pie = d3.layout.pie()
            .value(function (d) { return d.length; })(per_nick),
        arc = d3.svg.arc()
            .outerRadius(150)
            .startAngle(function (d) { return d.startAngle; })
            .endAngle(function (d) { return d.endAngle; });

    helpers.fixate_colors(data);

    var slice = svg.selectAll('.slice')
            .data(pie)
            .enter()
            .append('g')
            .attr('transform', 'translate(300, 300)');

    slice.append('path')
        .attr({d: arc,
               fill: function (d) { return helpers.color(d.data[0].from); }
              });

    slice.call(helpers.arc_labels(function (d) { return d.data[0].from; },
                                  arc.outerRadius()));
});
