
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
	    .attr("y", -overlaySize)
	    .on('click', blurNodes);

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
		links = svg.selectAll('.link')
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
	            	var l = "M" + nodeMap[d.source].x + "," + nodeMap[d.source].y + "A" + dr + "," + dr + " 0 0,1 " + nodeMap[d.target].x + "," + nodeMap[d.target].y;
	            	return l;
				});

		nodes = svg.selectAll('.node')
				.data(graphSource.nodes)
				.enter()
				.append('g')
				.attr('class','node')
				.attr('transform',function(d){
					return "translate(" + d.x + "," + d.y + ")";
				})
				.on('click', function(d){
					window.location = '#' + d.label;
					catchLocation.call(this, d);
				})

		nodes.append('circle')
			.attr('r', function(d){
				return d.size/1.5;
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
			.style('font-size', 12)
			.style('font-weight','bold')
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

	function blurNodes(){
		nodes.attr("class",'node');
		links.attr('class','link');
		$(".node").css('-webkit-opacity',0.2);
	}

	function selectNode(node, focus){
		blurNodes();
		nodes.attr("class","node background");
		$(this).attr('class',"node hover").css('-webkit-opacity', 1);

		links.filter(function(d){
			return d.source === node.label || d.target === node.label;
		})
		.attr('class','link hover')
		.each(function(d){
			nodes.filter(function(n){
				return n.label === d.target || n.label === d.source;
			})
			.attr("class", "node hover");
		});

		if (focus) {
			var coordinates = null;
			coordinates = [node.x, node.y];
			var x = (coordinates[0] * -1) + width / 2;
			var y = (coordinates[1] * -1) + height / 2;
			zoomer.translate([x, y]);
            zoomer.scale(1);

            svg.transition()
                .attr("transform", "translate(" + x + ", " + y + ") scale(1)");
		}


	}
	function catchLocation(node, focus){
		// console.log("title:" + node.label + ", PageRank:" + node.attributes.PageRank);
		$('#description').html("title:" + node.label + "\n PageRank:" + node.attributes.PageRank)
		selectNode.call(this, node, focus);
	}


}());