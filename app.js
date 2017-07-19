var app = angular.module("d3App", []);

app.controller("graphController", function ($scope, drawGraph) {
  //  $scope.draw = function () {
       // drawGraph.getData();
        drawGraph.draw();

 //   }
});


app.service("drawGraph", function ($http) {

    this.draw = function () {
     /*
                                    Line Chart
********************************************************************************************************
*/

// Set the dimensions of the canvas / graph
(function(){

var	margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
debugger;
var	parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

// Define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(8);

var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(7);

// Define the line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.close); });

// Adds the svg canvas

var	chart7 = d3.select(".linechart")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
 d3.csv("../data/line-graph.csv", function(error, data) {

	debugger;
	data.forEach(function(d) {
        //debugger;
      //  console.log(d.date);
		d.date = parseDate(d.date);
       // console.log(d.date)
		d.close = +d.close;
	});

	// Scale the range of the data
   // debugger;
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.close; })]);
 
	// Add the valueline path.
	chart7.append("path")		// Add the valueline path.
		.attr("class", "line")
		.attr("d", valueline(data));

	// Add the X 
  //  debugger;
	chart7.append("g")			// Add the X Axis
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Add the Y Axis
	chart7.append("g")			// Add the Y Axis
		.attr("class", "y axis")
		.call(yAxis);

});
})();

/*
                                    Bar Chart
     ********************************************************************************************************
*/ 
(function(){

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
//debugger;
var	parseDate1 = d3.time.format("%d-%b-%y").parse;

var x_scale = d3.scale.ordinal().rangeRoundBands([0,width], 0.2);
var y_scale = d3.scale.linear().range([height,0]);

var x_axis = d3.svg.axis().scale(x_scale).orient("bottom");
var y_axis = d3.svg.axis().scale(y_scale).orient("left").ticks(10);

var bar_chart = d3.select(".bar-chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../data/bar.csv", function(error,data) {

   // error check
   if (error) throw error;

   dataset = data; // store data into global var
   dataset.forEach(function(d) {
       debugger
    
      d.errors = d.errors;
      d.date = d.date;
      //d.date = parseDate1(d.date);
      console.log(d.date);
   });


   x_scale.domain(data.map(function(d) { return d.date; }));
   //x_scale.domain(d3.extent(data, function(d) { return d.date; }));
   debugger;
   y_scale.domain([0, d3.max(dataset, function(d) { return d.errors; })]);

   bar_chart.append("g").attr("class", "x axis").attr("transform", "translate(0, " + height + ")").call(x_axis).append("text")
    .attr("transform", "rotate(0)")
    .attr("x", 880)
    .attr("dy", "1em")
    .style("text-anchor", "start")
    .text("Date")
    .style("font-size","18px")
    .style("top",'40px');

   bar_chart.append("g").attr("class", "y axis").call(y_axis).append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Errors")
    .style("font-size","18px");

  bar_chart.selectAll(".bar").data(dataset).enter().append("rect")
    .attr("class", "bar")
    .attr("x",function(d) { return x_scale(d.date); })
    .attr("width", x_scale.rangeBand())
    .attr("y", function(d) { return y_scale(d.errors); })
    .attr("height", function(d) { return height - y_scale(d.errors); });
});


})();


/*
                                                   PIE CHART
*/
/***************************************************************************************************************** */

(function(){


var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select(".pie-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("../data/pie.csv", type, function(error, data) {
  if (error) throw error;
  
  console.log(pie(data))

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.age; });
});

function type(d) {
  d.population = +d.population;
  return d;
}
})();


    }
});
