jQuery(document).ready(function($) {
	$("#sidebar").resizable();
	$('#searchArea label p').css('text-align','center');
	$.supersized({
        slides : [ {image : '/js/build/black_dark_shadow.jpg'  } ]
    });

	// var layout ;
	// jQuery('#layout').selectmenu({
	// 	select : function(event, data){
	// 		layout = data.item.value;
	// 	},
	// 	width: "150px"
	// })
	// .css("margin-top", "50px");

	// jQuery("input[type=submit]").button({
	//     position:{my : "left center", at: "right center" }
	// })
	// .click(function(event){
	//     event.preventDefault;
	//     if(layout == 'Force'){
	//         jQuery("form").attr("action","graph.html");
	//     }
 //        else{
	//         jQuery("form").attr("action","/");
	//     }

	// });
});

