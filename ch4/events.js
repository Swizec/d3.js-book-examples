
var width = 1024,
    height = 768,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var radiate = function (pos) {
    d3.range(3).forEach(function (d) {
        svg.append('circle')
            .attr({cx: pos[0],
                   cy: pos[1],
                   r: 0})
            .style('opacity', '1')
            .transition()
            .duration(1000)
            .delay(d*50)
            .attr('r', 50)
            .style('opacity', '0.00001')
            .remove();
    });
};

svg.on('click', function () {
    radiate(d3.mouse(this));
});

svg.on('touchstart', function () {
    d3.touches(this).map(radiate);
});
