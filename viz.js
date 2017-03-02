//for map
var map = d3.geomap.choropleth()
    .geofile('d3-geomap/topojson/world/countries.json')
    .colors(['#DFECDF','#BFD9BF','#9FC69F','#80B380','#609F60','#408C40','#207920','#006600'])
    .column('y2000')
    .domain([0,2000000])
    .legend(true)
    .unitId('Code');

d3.csv('country&code.csv', function(error, data) {
    d3.select('#map')
        .datum(data)
        .call(map.draw, map);
    var ggg = d3.select('#map-svg');
    console.log(ggg)
    var ccc = d3.selectAll('g.units');
    console.log(ccc)
});

                // var ggg = d3.selectAll(self.svg);
                // console.log(ggg.nodeName)
                // //var ccc = ggg.selectAll("path");
                // //console.log(ccc)


// for bar chart

var currentDecade;

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 130, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10)

svg.append("text")
  .attr("class", "x label")
  .attr("x", width-10)
  .attr("y", height-5)
  .style("text-anchor", "middle")
  .text("Country");

svg.append("text")
    .attr("class", "y label")
    .attr("transform", "rotate(0)")
    .attr("x", 0)
    .attr("y", 15)
    .style("text-anchor", "start")
    .text("/1,000 people")
    

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

var form = document.getElementById("buttonDecade");
form.onchange = function(){
    currentDecade = form.elements["radioButton"].value;
    drawViz(currentDecade)
}

//initial view is set to 1990s
form.elements["radioButton"].value="1990s";
//render viz when first loaded
drawViz("1990s")

function drawViz(currentDecade){
    //clear the former viz and render a new one use different data
    g.selectAll("*").remove();
    //uncheck the sort checkbox when re-rendering
    document.getElementById("checkbox").checked = false;

    d3.csv("country&code.csv", function(d) {
        if (currentDecade == "1950s") {
            d.thousand = (+d.y1960)/1000
        } else if (currentDecade == "1960s") {
            d.thousand = (+d.y1970)/1000
        } else if (currentDecade == "1970s") {
            d.thousand = (+d.y1980)/1000
        } else if (currentDecade == "1980s") {
            d.thousand = (+d.y1990)/1000
        } else if (currentDecade == "1990s") {
            d.thousand = (+d.y2000)/1000
        }
        d.y2000 = +d.y2000;
        d.y1990 = +d.y1990;
        d.y1980 = +d.y1980;
        d.y1970 = +d.y1970;
        d.y1960 = +d.y1960;
        return d;
        },function(error, data) {
        if (error) throw error;

        x.domain(data.map(function(d) { return d.Country; }));

        if (currentDecade == "1950s" || currentDecade == "1960s"){
            y.domain([0, d3.max(data, function(d) { return d.thousand; })]);
        } else if (currentDecade == "1990s"){
            y.domain([0, d3.max(data, function(d) { return d.thousand/3; })]);
        } else {
            y.domain([0, d3.max(data, function(d) { return d.thousand/2; })]);
        }
        

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(-30," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("x", 6)
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

        g.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Country)-(x.bandwidth())/1.6 -30; })
            .attr("y", function(d) { return y(d.thousand); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.thousand); })
            .on("mouseover", function(d) { 
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html("Country: " + d.Country + "<br><b>" + currentDecade + ": " + d.thousand*1000 + "</b><hr>" + "1990s: " + d.y2000 + ",<br> 1980s: " + d.y1990 + ",<br> 1970s: " + d.y1980 + ",<br> 1960s: " + d.y1970 + ",<br> 1950s: " + d.y1960)
                        .style("left", (d3.event.pageX + 15) + "px")
                        .style("top", (d3.event.pageY - 60) + "px");
                    //d3.select(this).attr("r",8);
                        })
                .on("mouseout", function(d) { 
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                    });
            d3.select("input").on("change", change);


        function change() {
            var x0 = x.domain(data.sort(this.checked
                ? function(a, b) { return b.thousand - a.thousand; }
                : function(a, b) { return d3.ascending(a.Country, b.Country); })
                .map(function(d) { return d.Country; }))
                .copy();

            svg.selectAll(".bar")
                .sort(function(a, b) { return x0(a.Country) - x0(b.Country); });

            var transition = svg.transition().duration(250);//,
            // delay = function(d, i) { return i * 50; };

            transition.selectAll(".bar")
                //.delay(delay)
            .attr("x", function(d) { return x(d.Country)-(x.bandwidth())/1.6 - 30; })

            transition.select(".axis--x")
                .call(xAxis)
            .selectAll("g")
                //.delay(delay);
        }
        });
};

// //china.style.fill =  'red';
//     //d3.selectAll(".unit-CHN").html("I'm classy");
//         d3.select("g.unit-CHN").style("fill","red");
