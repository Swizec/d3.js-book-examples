
var width = 600,
    height = 600,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var random = d3.random.normal(.5, .11),
    data = d3.range(800).map(function (i) {
        return {x: random(),
                y: random()};
});

var x = d3.scale.linear()
        .range([50, width-50]),
    y = d3.scale.linear()
        .range([height-50, 50]);

svg.append('g')
    .classed('circles', true)
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr({cx: function (d) { return x(d.x); },
           cy: function (d) { return y(d.y); },
           r: 4});

svg.append('g')
    .classed('axis', true)
    .attr('transform', 'translate(50, 0)')
    .call(d3.svg.axis().orient('left').scale(y));

svg.append('g')
    .classed('axis', true)
    .attr('transform', 'translate(0, '+(height-50)+')')
    .call(d3.svg.axis().orient('bottom').scale(x));

svg.append("g")
    .classed("brush", true)
    .call(d3.svg.brush().x(x).y(y)
    .on("brushstart", brushstart)
    .on("brush", brushmove)
    .on("brushend", brushend));

function brushstart() {
    svg.select('.circles')
        .classed('selecting', true);
}

function brushmove() {
    var e = d3.event.target.extent();

    svg.selectAll('circle')
        .classed("selected", function(d) {
            return e[0][0] <= d.x && d.x <= e[1][0]
                && e[0][1] <= d.y && d.y <= e[1][1];
        });
}

function brushend() {
    svg.select('.circles')
        .classed('selecting', !d3.event.target.empty());
}
