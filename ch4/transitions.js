
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var eases = ['linear', 'poly(4)', 'quad', 'cubic', 'sin', 'exp', 'circle', 'elastic(1, 2)', 'back(2)', 'bounce'],

    y = d3.scale.ordinal().domain(eases).rangeBands([50, 500]);

svg.selectAll('circle')
    .data(eases)
    .enter()
    .append('circle')
    .attr({cx: 100,
           cy: y,
           r: y.rangeBand()/2-5})
    .transition()
    .delay(400)
    .duration(2000)
    .attr({cx: 500})
    .ease(function (d) { return d3.ease(d); });

//var circle = function () {
/*    svg.append('circle')
        .attr({cx: 100,
               cy: 100,
               r: 20})
        .transition()
        .attr({cx: 600})
        .ease('exp');*/
