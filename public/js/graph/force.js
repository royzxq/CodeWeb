(function(){

	var width = window.innerWidth,
	        height = window.innerHeight;

	//D3 force directed layout
	//Try playing with the charge and link distance
	var force = d3.layout.force()
	    .charge(-30)
	    .linkDistance(30)
	    .size([width, height]);

	var tip = d3.tip()
	    .attr("class","d3-tip")
	    .html(function(d){return "name: " + d.label;});

	var svg = d3.select('body').append("svg")
				.attr('width',width)
				.attr('height',height)
				.call(tip);
	var nodeMap = {};
			
	d3.json('/js/edge.json', function(err, graph){
		if (err) {
			console.log(err);
			return null;
		}
		
		for(var i = 0 ; i < graph.nodes.length; i++){
			nodeMap[graph.nodes[i].label] = graph.nodes[i];
		}

		force.nodes(graph.nodes)
			.links(graph.edges)
			.start();

		var links = svg.selectAll('.link')
					.data(graph.edges)
					.enter()
					.append('line')
					.attr('class','line')
					.attr('stroke', function(d){return d.color;})

		var nodes = svg.selectAll('.node')
					.data(graph.nodes)
					.enter()
					.append('g')
					.call(force.drag)
					.on('mouseover', tip.show)
					.on('mouseout',tip.hide);

		nodes.append('circle')
			.attr('r',function(d){
				return d.size/2;
			})
			.attr("fill", function(d){
				return d.color;
			})
			.attr("class",'node');
			
		force.on('tick',function(){
			links.attr("x1",function(d){return nodeMap[d.source].x})
				.attr('x2', function(d){return nodeMap[d.target].x})
				.attr('y1',function(d){return nodeMap[d.source].y})
				.attr('y2',function(d){return nodeMap[d.target].y});

			nodes.attr("transform", function(d){return "translate("+d.x +","+d.y+")";});
		});
			
	});

	

}());
