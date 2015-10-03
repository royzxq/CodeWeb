
(function() {
	var width = window.innerWidth,
		height = window.innerHeight;

	var zoomer = d3.behavior.zoom().scaleExtent([-20, 20]).on("zoom", zoom);
	var svg = d3
	    .select("body")
	    .append("svg")
	    .attr("shape-rendering", "auto")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .call(zoomer)
	    .append("g");

    if (!location.hash) {
	    zoomer.scale(0.6);
	    zoomer.translate([850, 700]);
	    svg.attr("transform","translate(830, 700) scale(0.7)");
	}

	var overlaySize = width * 10; // maxzoomlevel
	var rect = svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", (width * 10) + overlaySize)
	    .attr("height", (height * 10) + overlaySize)
	    .attr("x", -overlaySize)
	    .attr("y", -overlaySize);

	var nodes, links, text, graphSource;
	var initSize = [];
	d3.json("/js/edge.json", function(error, graph) {
	    graphSource = graph;
	    // console.log(graph);
	    loadGraph();
	    $('circle').each(function(d){
	        initSize.push($(this).attr('r'));
	    });
	});


	function loadGraph(){
		var nodeMap = {};
		for(var i = 0 ; i < graphSource.nodes.length; i++){
			nodeMap[graphSource.nodes[i].label] = graphSource.nodes[i];
		}
		// console.log(nodeMap);
		link = svg.selectAll('.link')
				.data(graphSource.edges)
				.enter()
				.append('path')
				.attr('class','link')
				.attr('fill',"none")
				.attr('stroke', function(d){
					return "yellow";
				})
				.attr('d',function(d){
					var dx = nodeMap[d.target].x - nodeMap[d.source].x,
	                dy = nodeMap[d.target].y - nodeMap[d.source].y,
	                dr = Math.sqrt(dx * dx + dy * dy);
	            	return "M" + nodeMap[d.source].x + "," + nodeMap[d.source].y + "A" + dr + "," + dr + " 0 0,1 " + nodeMap[d.target].x + "," + nodeMap[d.target].y;
				});

		nodes = svg.selectAll('.node')
				.data(graphSource.nodes)
				.enter()
				.append('g')
				.attr('class','node')
				.attr('transform',function(d){
					return "translate(" + d.x + "," + d.y + ")";
				});

		nodes.append('circle')
			.attr('r', function(d){
				return d.size;
			})
			.style('fill',function(d){
				return d.color;
			});

		nodes.append('text')
			.attr('class',function(d){
				return d.size > 18 ? "huge":"small";
			})
			.attr("dx", 0)
			.attr('dy','0.2em')
			.style('text-anchor','middle')
			.style('font-size', 6)
			.text(function(d){
				if (d.size > 18) {
					var title = d.label.split('_')[0];
					return title;
				}
				return null;
				
			});
	}

	function zoom(){
		svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
	}


}());