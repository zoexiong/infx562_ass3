var map = d3.geomap.choropleth()
    .geofile('../d3-geomap/topojson/world/countries.json')
    .colors(['#E3E3F9','#C6C6F4','#AAAAEE','#8E8EE8','#7171E3','#5555DD','#3939D7','#0000CC'])
    .column('y2000')
    .domain([0,2000000])
    .legend(true)
    .unitId('Country');

d3.csv('geo.csv', function(error, data) {
    d3.select('#map')
        .datum(data)
        .call(map.draw, map);
    var ggg = d3.select('#map-svg');
    console.log(ggg)
    var ccc = d3.select('#unit-CHN');
    console.log(ccc)
});

   