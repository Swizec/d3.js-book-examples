
var width = 1200,
    height = 800,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var projection = d3.geo.equirectangular()
        .center([14, 46])
        .scale(1000);

var colors = d3.scale.ordinal().range(colorbrewer.RdBu[8]);

d3.json('countries.json', function (countries) {
    svg.selectAll('path')
        .data(topojson.object(countries, countries.objects['ne_10m_admin_0_countries']).geometries)
        .enter()
        .append('path')
        .attr('d', d3.geo.path().projection(projection))
        .style('fill', function (d, i) { return colors(i); });
});
