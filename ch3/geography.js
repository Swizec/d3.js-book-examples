
var width = 1800,
    height = 1200,
    svg = d3.select('#graph')
        .append('svg')
        .attr({width: width,
               height: height});

var projection = d3.geo.equirectangular()
        .center([8, 56])
        .scale(800);

queue()
    .defer(d3.json, 'data/water.json')
    .defer(d3.json, 'data/land.json')
    .defer(d3.json, 'data/cultural.json')
    .await(draw);

function add_to_map(collection, key) {
    return svg.append('g')
        .selectAll('path')
        .data(topojson.object(collection, 
                              collection.objects[key]).geometries)
        .enter()
        .append('path')
        .attr('d', d3.geo.path().projection(projection));
}

function draw (err, water, land, cultural) {
   add_to_map(water, 'ne_50m_ocean')
        .classed('ocean', true);

    add_to_map(land, 'ne_50m_land')
        .classed('land', true);

    add_to_map(water, 'ne_50m_rivers_lake_centerlines')
        .classed('river', true);

    add_to_map(cultural, 'ne_50m_admin_0_boundary_lines_land')
        .classed('boundary', true);

    add_to_map(cultural, 'ne_10m_urban_areas')
        .classed('urban', true);
};
