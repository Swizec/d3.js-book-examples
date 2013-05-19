
window.helpers = {
    uniques: function (data, nick) {
        var uniques = [];

        data.forEach(function (d) {
            if (uniques.indexOf(nick(d)) < 0) {
                uniques.push(nick(d));
            }
        });

        return uniques;
    },

    nick_id: function (data, nick) {
        var uniques = helpers.uniques(data, nick);

        return d3.scale.ordinal()
            .domain(uniques)
            .range(d3.range(uniques.length));
    },

    bin_per_nick: function (data, nick) {
        var nick_id = helpers.nick_id(data, nick);

        var histogram = d3.layout.histogram()
                .bins(nick_id.range())
                .value(function (d) { return nick_id(nick(d)); })(data);

        return histogram;
    },

    tickAngle: function (d) {
        var midAngle = (d.endAngle-d.startAngle)/2,
            degrees = (midAngle+d.startAngle)/Math.PI*180-90;

        return degrees;
    },

    color:  d3.scale.ordinal()
        .range(['#EF3B39', '#FFCD05', '#69C9CA', '#666699', '#CC3366', '#0099CC',
                '#CCCB31', '#009966', '#C1272D', '#F79420', '#445CA9', '#999999',
                '#402312', '#272361', '#A67C52', '#016735', '#F1AAAF', '#FBF5A2',
                '#A0E6DA', '#C9A8E2', '#F190AC', '#7BD2EA', '#DBD6B6', '#6FE4D0']),

    arc_labels: function (text, radius) {
        return function (selection) {
            selection.append('text')
                .text(text)
                .attr('text-anchor', function (d) {
                    return helpers.tickAngle(d) > 100 ? 'end' : 'start';
                })
                .attr('transform', function (d) {
                    var degrees = helpers.tickAngle(d);

                    var turn = 'rotate('+degrees+') translate('+(radius(d)+10)+', 0)';

                    if (degrees > 100) {
                        turn += 'rotate(180)';
                    }

                    return turn;
                });
        };
    },

    tooltip: function (text) {

        return function (selection) {
            selection.on('mouseover.tooltip', mouseover)
                .on('mousemove.tooltip', mousemove)
                .on('mouseout.tooltip', mouseout);

            function mouseover(d) {
                var path = d3.select(this);
                path.classed('highlighted', true);

                var mouse = d3.mouse(svg.node());

                var tool = svg.append('g')
                        .attr({'id': "nicktool",
                               transform: 'translate('+(mouse[0]+5)+', '+(mouse[1]+10)+')'});

                var textNode = tool.append('text')
                        .text(text(d)).node();

                tool.append('rect')
                    .attr({height: textNode.getBBox().height,
                           width: textNode.getBBox().width,
                           transform: 'translate(0, -16)'});

                tool.select('text')
                    .remove();

                tool.append('text')
                    .text(text(d));
            }

            function mousemove () {
                var mouse = d3.mouse(svg.node());
                d3.select('#nicktool')
                    .attr('transform', 'translate('+(mouse[0]+15)+', '+(mouse[1]+20)+')');
            }

            function mouseout () {
                var path = d3.select(this);
                path.classed('highlighted', false);

                d3.select('#nicktool').remove();
            }
        };
    },

    make_tree: function (data, filter1, filter2, nick1, nick2) {
        var tree = {nick: 'karma',
                    children: []};
        var uniques = helpers.uniques(data, function (d) { return d.from; });

        tree.children = uniques.map(
            function (nick) {
                var my_karma = data.filter(function (d) { return filter1(d, nick); }).length,
                    given_to = helpers.bin_per_nick(
                        data.filter(function (d) { return filter2(d, nick); }),
                        nick1
                    );

                return {nick: nick,
                        count: my_karma,
                        children: given_to.map(function (d) {
                            return {nick: nick2(d),
                                    count: d.length,
                                    children: []};
                        })};
            });

        return tree;
    },

    fixate_colors: function (data) {
        helpers.color.domain(helpers.uniques(data, function (d) { return d.from; }));
    },

    connection_matrix: function (data) {
        var nick_id = helpers.nick_id(data, function (d) { return d.from; }),
            uniques = nick_id.domain();
        
        var matrix = d3.range(uniques.length).map(function () {
            return d3.range(uniques.length).map(function () { return 0; });
        });
        
        data.forEach(function (d) {
            matrix[nick_id(d.from)][nick_id(d.to)] += 1;
        });

        return matrix;
    }
};
