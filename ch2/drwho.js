
var Data;

var table = d3.select('#graph')
        .append('table')
        .attr('class', 'table');

var thead = table.append('thead'),
    tbody = table.append('tbody');

var reload = function () {
    d3.csv('villains.csv', function (data) {
        Data = data;
        redraw();
    });
};
reload();

var redraw = function () {
    var tr = tbody.selectAll('tr')
            .data(Data);

    tr.style('color', 'red');

    tr.enter()
        .append('tr');

    tr.exit()
        .remove();

    tr.selectAll('td')
        .data(function (d) { return d3.values(d); })
        .enter()
        .append('td')
        .text(function (d) { return d; });
};
