
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
	    svg.attr("transform","translate(830, 700) scale(0.4)");
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
	var nodeMap = {};
	var initSize = [], nodeTitle = [];
	
	d3.json("/js/Fruchterman.json", function(error, graph) {
	    graphSource = graph;
	    // console.log(graph);
	    loadGraph();
	    jQuery('circle').each(function(d){
	        initSize.push(jQuery(this).attr('r'));
	    });
	});


	function loadGraph(){
		
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
					catchLocation.call(this, d.label);
				})

		nodes.append('circle')
			.attr('r', function(d){
				var label = d.label.split('_').join(" ");
				nodeTitle.push(label);
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
			.style('font-size', 20)
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
		jQuery(".node").css('-webkit-opacity',0.2);
	}

	function selectNode(node, focus){
		blurNodes();
		nodes.attr("class","node background");
		jQuery(this).attr('class',"node hover").css('-webkit-opacity', 1);

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
		node = nodeMap[node];
		var label = node.label.split('_').join(' ');
		$('#description').html("Title: " + label + "<br> PageRank: " + parseFloat(node.attributes.PageRank).toFixed(5) );
		// $('#sidebar').css("width", "auto");
		jQuery.ajax({
			type: "GET",
			url : "/probs/" + node.label
		}).then(function(prob){
				$('#description').append("<br><a href='"+ prob.link + "'> Link </a>");
				// 
			});
		selectNode.call(this, node, focus);
	}

	jQuery("#search").keypress(function(event){
		if (event.which == 13) {
			var searchField = jQuery("#search").val();
			// console.log(typeof(searchField));
		    window.location = '#' + searchField;
		    searchField = searchField.split(' ').join('_')
		    catchLocation(searchField, true);
		}
	   
	//    console.log(searchField);
	});

	jQuery("#slider").slider({
	    orientation: "horizantal",
	    range: "min",
	    max: 15,
	    value: 8,
	    slide: reSize,
	    change:reSize
	});

	function reSize(){
		var count = 0;
		jQuery('circle').each(function(d){
			jQuery(this).attr('r', function(){
				return initSize[count++] * jQuery("#slider").slider("value") / 8
			});
		});	
	};

	var substringMatch = function(strs){
		return function findMatch(q, cb){
			var matches, substringRegex;
			matches = [];
			substringRegex = new RegExp(q, 'i');

			jQuery.each(strs, function(i, str){
				if (substringRegex.test(str)) {
					matches.push(str);
				}
			})
			cb(matches);
		};
	}

	$('#searchArea, #search').typeahead({
		hint: false,
		highlight: true,
		minLength: 2
	},{
		name: 'title',
		source: substringMatch(nodeTitle)
	});


}());