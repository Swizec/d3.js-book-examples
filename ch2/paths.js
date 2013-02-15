
var width = 1024,
    height = 768,
    margin = 10;

var svg = d3.select('#graph')
        .append('svg')
        .attr('width', width+margin*2)
        .attr('height', height+margin*2);

var g = svg.append('g')
        .attr('transform', 'translate('+margin+', '+margin+')');

var sine = d3.range(0,10).map(
    function (k) { return [0.5*k*Math.PI, 
                           Math.sin(0.5*k*Math.PI)]; });

var x = d3.scale.linear()
        .range([0, width/2-margin])
        .domain(d3.extent(sine, function (d) { return d[0]; })),
    y = d3.scale.linear().range([height/2-margin, 0]).domain([-1, 1]);

var line = d3.svg.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); });

g.append('path')
    .datum(sine)
    .attr("d", line)
    .attr({stroke: 'steelblue',
           'stroke-width': 2,
           fill: 'none'});

d3.range(0, 11).map(function (i) {
    g.append('path')
        .datum(sine)
        .attr("d", line.interpolate('cardinal').tension(i/10))
        .attr({stroke: 'black',
               'stroke-width': 1,
               fill: 'none'});
});

var g2 = svg.append('g')
        .attr('transform', 'translate('+(width/2+margin)+', '+margin+')');

var area = d3.svg.area()
        .x(function (d) { return x(d[0]); })
        .y0(height/2)
        .y1(function (d) { return y(d[1]); })
        .interpolate('basis');

g2.append('path')
    .datum(sine)
    .attr("d", area)
    .attr({fill: 'steelblue',
           'fill-opacity': 0.4});

g2.append('path')
    .datum(sine)
    .attr("d", line.interpolate('basis'))
    .attr({stroke: 'steelblue',
           'stroke-width': 2,
           fill: 'none'});

var g3 = svg.append('g')
        .attr('transform', 'translate('+margin+', '+(height/2+margin)+')');

var arc = d3.svg.arc();

g3.append('path')
    .attr("d", arc({outerRadius: 100,
                    innerRadius: 50,
                    startAngle: -Math.PI*0.25,
                    endAngle: Math.PI*0.25}))
    .attr('transform', 'translate(150, 150)')
    .attr('fill', 'lightslategrey');

var symbols = d3.svg.symbol()
        .type(function (d, i) {
            if (d[1] > 0) {
                return 'triangle-down';
            }else{
                return 'triangle-up';
            }
        })
        .size(function (d, i) {
            if (i%2) {
                return 0;
            }else{
                return 64;
            }
        });

g2.selectAll('path')
    .data(sine)
    .enter()
    .append('path')
    .attr('d', symbols)
    .attr('transform', function (d) { return 'translate('+x(d[0])+','+y(d[1])+')'; })
    .attr({stroke: 'steelblue',
           'stroke-width': 2,
           fill: 'white'});

var chord = d3.svg.chord();

g3.append('g').selectAll('path')
    .data([{
        source: {radius: 50,
                 startAngle: -Math.PI*0.30,
                 endAngle: -Math.PI*0.20},
        target: {radius: 50,
                 startAngle: Math.PI*0.30,
                 endAngle: Math.PI*0.30}}])
    .enter()
    .append('path')
    .attr("d", d3.svg.chord())
    .attr('transform', 'translate(300, 100)');

var data = d3.zip(d3.range(0, 12),
                  d3.shuffle(d3.range(0, 12))),
    colors = ['linen', 'lightsteelblue', 'lightcyan', 
              'lavender', 'honeydew', 'gainsboro'];

var chord = d3.svg.chord()
        .source(function (d) { return d[0]; })
        .target(function (d) { return d[1]; })
        .radius(150)
        .startAngle(function (d) { return -2*Math.PI*(1/data.length)*d; })
        .endAngle(function (d) { return -2*Math.PI*(1/data.length)*((d-1)%data.length); });

g3.append('g')
    .attr('transform', 'translate(300, 200)')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', chord)
    .attr('fill', function (d, i) { return colors[i%colors.length]; })
    .attr('stroke', function (d, i) { return colors[(i+1)%colors.length]; });

var g4 = svg.append('g')
        .attr('transform', 'translate('+(width/2)+','+(height/2)+')');

var moustache = [
    {source: {x: 250, y: 100}, target: {x: 500, y: 90}},
    {source: {x: 500, y: 90}, target: {x: 250, y: 120}},
    {source: {x: 250, y: 120}, target: {x: 0, y: 90}},
    {source: {x: 0, y: 90}, target: {x: 250, y: 100}},
    {source: {x: 500, y: 90}, target: {x: 490, y: 80}},
    {source: {x: 0, y: 90}, target: {x: 10, y: 80}}
];

g4.selectAll('path')
    .data(moustache)
    .enter()
    .append('path')
    .attr("d", d3.svg.diagonal())
    .attr({stroke: 'black',
           fill: 'none'});


//g4.append('path')
//    .datum({source: {x: 0, y: 100},
//            target: {x: 500, y: 100})

/*g4.selectAll('path')
    .data(function (d) { return d; })
    .enter()
    .append('path')
    .attr("d", diagonal);*/

/*var line = d3.svg.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.motorways); })
        .defined(function (d) { return !isNaN(d.year) && !isNaN(d.motorways); });

d3.tsv('motorways.tsv', function (data) {
    data = data.map(function (d) {
        return {country: d['unit,geo\\time'].split(',')[1],
                data: d3.keys(d)
                        .filter(function (k) { return k != 'unit,geo\\time'; })
                        .map(function (k) {
                            return {year: Number(k),
                                    motorways: Number(d[k])};
                        })};
    });
    
    console.log(data.map(function (d) { return d.country; }));

    var france = data.filter(function (d) { return d.country == 'FR'; })[0];

    x.domain(d3.extent(france.data, function (d) { return d.year; }));
    y.domain(d3.extent(france.data, function (d) { return d.motorways; }));

    g.append('path')
        .datum(france.data)
        .attr("d", line)
        .attr({stroke: 'steelblue',
               'stroke-width': 2,
               fill: 'none'});
});
*/
