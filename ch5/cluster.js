
var width = 1024,
    height = 768,
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
                count: data.filter(function (d) { return d.from == nick; }).length,
                children: helpers.bin_per_nick(
                    data.filter(function (d) { return d.from == nick; }),
                    function (d) { return d.to; }).map(function (d) {
                        return {nick: d[0].to,
                                count: d.length,
                                children: []};
                    })};
    });

    
    
});
