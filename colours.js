
var width = 1024,
    height = 768,
    rings = 15;

var svg = d3.select('#graph')
        .append('svg')
        .style({width: width,
                height: height});

var colors = d3.scale.category20b();

var angle = d3.scale.linear().domain([0, 20]).range([0, 2*Math.PI]);

var arc = d3.svg.arc()
        .innerRadius(function (d) { return d*50/rings; })
        .outerRadius(function (d) { return 50+d*50/rings; })
        .startAngle(function (d, i, j) { return angle(j); })
        .endAngle(function (d, i, j) { return angle(j+1); });

var shade = {
    darker: function (d, j) { return d3.rgb(colors(j)).darker(d/rings); },
    brighter: function (d, j) { return d3.rgb(colors(j)).brighter(d/rings); }
};

[[100, 100, shade.darker],
 [300, 100, shade.brighter]].forEach(function (conf) {
     svg.append('g')
         .attr('transform', 'translate('+conf[0]+', '+conf[1]+')')
         .selectAll('g')
         .data(colors.range())
         .enter()
         .append('g')
         .selectAll('path')
         .data(function (d) { return d3.range(0, rings); })
         .enter()
         .append('path')
         .attr("d", arc)
         .attr('fill', function (d, i, j) { return conf[2](d, j); });
});
