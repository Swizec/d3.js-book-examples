
var width = 1024,
    height = 1024,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

d3.json('data/karma_matrix.json', function (data) {
    
    var uniques = helpers.uniques(data, function (d) { return d.from; }),
        nick_id = d3.scale.ordinal()
            .domain(uniques)
            .range(d3.range(uniques.length)),
        color = d3.scale.ordinal()
            .domain(d3.range(uniques.length))
            .range(['#EF3B39', '#FFCD05', '#69C9CA', '#666699', '#CC3366', '#0099CC', 
                    '#CCCB31', '#009966', '#C1272D', '#F79420', '#445CA9', '#999999', 
                    '#402312', '#272361', '#A67C52', '#016735', '#F1AAAF', '#FBF5A2', 
                    '#A0E6DA', '#C9A8E2', '#F190AC', '#7BD2EA', '#DBD6B6', '#6FE4D0']);

    var matrix = d3.range(uniques.length).map(function () {
        return d3.range(uniques.length).map(function () { return 0; });
    });

    data.forEach(function (d) {
        matrix[nick_id(d.from)][nick_id(d.to)] += 1;
    });

    svg = svg.append('g')
        .attr('transform', 'translate('+width/2+','+height/2+')');

    var innerRadius = Math.min(width, height)*0.3,
        outerRadius = innerRadius*1.1;

    var chord = d3.layout.chord()
            .padding(.05)
            .sortGroups(d3.descending)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending)
            .matrix(matrix);

    svg.append('g')
        .selectAll('path')
        .data(chord.groups)
        .enter()
        .append('path')
        .attr('d', d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .attr('fill', function (d) { return color(d.index); });
   
    svg.append('g')
        .selectAll('text')
        .data(chord.groups)
        .enter()
        .append('text')
        .text(function (d) { return uniques[d.index]; })
        .attr('text-anchor', function (d) {
            return helpers.tickAngle(d) > 100 ? 'end' : 'start';
        })
        .attr('transform', function (d) {
            var degrees = helpers.tickAngle(d);

            var turn = 'rotate('+degrees+') translate('+(outerRadius+10)+', 0)';

            if (degrees > 100) {
                turn += 'rotate(180)';
            }

            return turn;
        });

    svg.append('g')
        .classed('chord', true)
        .selectAll('path')
        .data(chord.chords)
        .enter()
        .append('path')
        .attr('d', d3.svg.chord().radius(innerRadius))
        .attr('fill', function (d) { return color(d.target.index); });
});
