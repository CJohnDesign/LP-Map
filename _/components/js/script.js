$(document).ready(function() {

	var margin = { top: 0, left: 0, right: 0, bottom: 0},
		w, 
		heightCalc, 
		h; 

    function sizeChange() {
    	w = $("#main").width() - margin.left - margin.right,
		heightCalc = [w * 0.8, $(window).height() * 0.75],
		h = d3.min(heightCalc)
		d3.select("#map_svg")
			.attr("width", w)
			.attr("height", h)
		console.log(h)
    }

    sizeChange();

	d3.select(window)
    		.on("resize", sizeChange);

	// Define Zoom Behavior
	var zoom = d3.zoom()
		.scaleExtent([.15, 10])
		.on("zoom", zoomFunction)

	// Define Zoom Function Event Listener
	function zoomFunction() {
		var transform = d3.event.transform;
		d3.select("#map_g")
		.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")")
	}

	// Projection
	var projection = d3.geoMercator()
		.translate([ w/2, h/2 ])
		.scale([w/5])

	d3.queue()
		.defer(d3.json, "/json/world-mb.topojson ")
		.defer(d3.csv, "/csv/retailers.csv")
		.await(ready)

	//Define default path generator
	var path = d3.geoPath()
		.projection(projection)

	//Create SVG element
	var svg = d3.select("#main")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("id", "map_svg")
		.style("border", "1px solid #efefef")
		.call(zoom)
		.append("g")
		.attr("id", "map_g")


function ready (error, data) {
	console.log(data)
	var countries = topojson.feature(data, data.objects.countries).features
	console.log(countries)
	svg.selectAll(".country")
		.data(countries)
		.enter()
		.append("path")
		.attr("class", "country")
		.attr("d", path)
}
			
	



});
