// Helper Methods
function length(i, j) {
	return Math.sqrt(i*i + j*j);
}

function distance(i, j) {
	debug("Dist: <br />i:" + JSON.stringify(i) +"<br />j:" + JSON.stringify(j) );
	
	return Math.sqrt((i.x-j.x)^2 + (i.z-j.z)^2);	
}

function vertex(x,y,z){ 
	return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
}

function vector3(x,y,z){ 
	return new THREE.Vector3(x,y,z); 
}

var DEBUG_ON = false;
$(document).ready(function(e) {
    if (DEBUG_ON)
		startDebugging();
});
function startDebugging(){
	$('body').append(	"<div id='debug_container'>"+
					 	"<div id='debug_header'>Debug: </div>"+
						"<div id='debug_wrapper'><div id='debug'></div>"+
					   	"</div></div>");
	$( "#debug_container" ).draggable({handle:'#debug_header'}).resizable();
}

function debug(msg) {
	if (DEBUG_ON)
	{
		$("#debug").append(msg + "<br />");
		$("#debug_wrapper").stop()
			.animate({ scrollTop: $('#debug').height() }, 500);
	}
}