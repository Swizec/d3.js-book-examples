
var width = 1024,
    height = 1024,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {
    
    var uniques = helpers.uniques(data, function (d) { return d.from; }),
        matrix = helpers.connection_matrix(data);

    var innerRadius = Math.min(width, height)*0.3,
        outerRadius = innerRadius*1.1;

    var chord = d3.layout.chord()
            .padding(.05)
            .sortGroups(d3.descending)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending)
            .matrix(matrix);

    var diagram = svg.append('g')
            .attr('transform', 'translate('+width/2+','+height/2+')');


    var group = diagram.selectAll('.group')
            .data(chord.groups)
            .enter()
            .append('g'),
        arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

    group.append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return helpers.color(d.index); });

    group.call(helpers.arc_labels(function (d) { return uniques[d.index]; },
                                  function () { return outerRadius+10; }));

    diagram.append('g')
        .classed('chord', true)
        .selectAll('path')
        .data(chord.chords)
        .enter()
        .append('path')
        .attr('d', d3.svg.chord().radius(innerRadius))
        .attr('fill', function (d, i) { return helpers.color(d.target.index); });
});
