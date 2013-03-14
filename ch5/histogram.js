
var width = 1024,
    height = 600,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height})
        .style('margin', '20px');


d3.json('data/karma_matrix.json', function (data) {

    var uniques = [];
    
    data.forEach(function (d) {
        if (uniques.indexOf(d.to) < 0) {
            uniques.push(d.to);
        }
    });

    var nick = d3.scale.ordinal().domain(uniques).range(d3.range(uniques.length));

    var histogram = d3.layout.histogram()
            .bins(nick.range())
            .value(function (d) { return nick(d.to); })(data);

    var x = d3.scale.linear()
            .domain([0, d3.max(histogram, function (d) { return d.x; })])
            .range([0, width]),
        y = d3.scale.linear()
            .domain([0, d3.max(histogram, function (d) { return d.y; })])
            .range([height, 0]);

    console.log(histogram);

    svg.selectAll('rect')
        .data(histogram)
        .enter()
        .append('rect')
        .attr({x: function (d) { return x(d.x)+1; },
               y: function (d) { return y(d.y); },
               width: x(histogram[0].dx)-1,
               height: function (d) { return height-y(d.y); }
              });
});
