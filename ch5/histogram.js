
var width = 1024,
    height = 600,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height})
        .style('margin', '20px');


d3.json('data/karma_matrix.json', function (data) {

    var uniques = [],
        bottom_pad = 100;
    
    data.forEach(function (d) {
        if (uniques.indexOf(d.to) < 0) {
            uniques.push(d.to);
        }
    });

    var nick_id = d3.scale.ordinal().domain(uniques).range(d3.range(uniques.length));

    var histogram = d3.layout.histogram()
            .bins(nick_id.range())
            .value(function (d) { return nick_id(d.to); })(data);

    var x = d3.scale.linear()
            .domain([0, d3.max(histogram, function (d) { return d.x; })])
            .range([0, width]),
        y = d3.scale.linear()
            .domain([0, d3.max(histogram, function (d) { return d.y; })])
            .range([height-bottom_pad, 0]);

    var bar = svg.selectAll('.bar')
            .data(histogram)
            .enter()
            .append('g')
            .classed('bar', true)
            .attr('transform', 
                  function (d) { return 'translate('+x(d.x)+', '+y(d.y)+')'; });

    bar.append('rect')
        .attr({x: 1,
               width: x(histogram[0].dx)-1,
               height: function (d) { return height-bottom_pad-y(d.y); }
              });

    bar.append('text')
        .text(function (d) { return d[0].to; })
        .attr({transform: function (d) {
                   var bar_height = height-bottom_pad-y(d.y);

                   return 'translate(0, '+(bar_height+7)+') rotate(60)'; }
        });
        
});
