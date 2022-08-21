var HERO_WIDTH = 10, 
	  HERO_HEIGHT = 10, 
	  HERO_DEPTH = 10;

var HERO = function(scene, x, y, z) {
	var scope = {};
	
	scope.geometry;
	scope.cubeMaterial
	scope.cube;
	scope.color;
	
	scope.connectedObject;
	
	// The number of treasures this hero has collected
	scope.score;
	
	scope.movementSpeed;
	// -1 or 1
	scope.movementDirection;
	// From 0.0 to 1.0
	scope.movementPercentage;
	
	// Create the hero at a specified node
	scope.init = function(start_node)
	{
		scope.connectedObject = start_node;
		scope.score = 0;
		UI.dialogs['score'].update(scope.score);
		
		scope.movementSpeed = 0.05;
		scope.movementDirection = 1;
		
		// Create the actual shown object and add it to the scene
		scope.geometry = new THREE.CubeGeometry( HERO_WIDTH, HERO_HEIGHT, HERO_DEPTH);
		
		scope.color = new THREE.Color();
		scope.color.setHSV( 0.16, 
							0.60, 
							0.70 + Math.random() * 0.25 );
		
		scope.cubeMaterial = new THREE.MeshLambertMaterial( { color: scope.color.getHex() } );
		
		var startPos = start_node.getPosition();
		
		scope.cube = new THREE.Mesh(scope.geometry, scope.cubeMaterial ) ;
		scope.cube.position.x = startPos.x;
		scope.cube.position.y = startPos.y;
		scope.cube.position.z = startPos.z;
		scope.cube.OBJ_TYPE = WORLD_OBJECT_TYPES.HERO;
		// Create circular reference to get back to this object from cube
		scope.cube.scope = scope;
		
		// add the sphere to the scene
		SCENE.add(scope.cube);
	}
	
	scope.updatePosition = function(pos) 
	{
		scope.cube.position.x = pos.x;
		scope.cube.position.y = pos.y;
		scope.cube.position.z = pos.z;		
	}
	
	scope.getPosition = function()
	{
		return scope.cube.position;
	}
	
	scope.updateLocation = function() 
	{
		var type = scope.connectedObject.getType();
		
		if (type === WORLD_OBJECT_TYPES.NODE) {
			var nodePosition = scope.connectedObject.getPosition();
			
			scope.cube.position.x = nodePosition.x;
			scope.cube.position.y = nodePosition.y;
			scope.cube.position.z = nodePosition.z;
			
			// Check for treasure node
			if (scope.connectedObject.isTreasureNode)
			{
				scope.score+=1;
				UI.dialogs['score'].update(scope.score);
				
				WORLD.pickTreasureNode();
			}
			
			// It's in a node, so find the next edge to go on
			scope.decideNextEdge();
		}
		else if (type === WORLD_OBJECT_TYPES.EDGE) {
			//TODO: Traverse the edge
			var edge = scope.connectedObject;
			var node1 = edge.node1;
			var node2 = edge.node2;
			
			// move forward a bit
			scope.movementPercentage+=scope.movementSpeed * scope.movementDirection;
			
			// Figure out the position based on the weighted average
			var pos1 = node1.getPosition();
			var pos2 = node2.getPosition();
			var direction = vector3(pos2.x-pos1.x, pos2.y-pos1.y, pos2.z-pos1.z).normalize();
			
			// Orig + direction*length*percent
			scope.cube.position.x = pos1.x + direction.x*scope.movementPercentage*Math.abs(pos2.x-pos1.x);
			scope.cube.position.y = pos1.y + direction.y*scope.movementPercentage*Math.abs(pos2.y-pos1.y);
			scope.cube.position.z = pos1.z + direction.z*scope.movementPercentage*Math.abs(pos2.z-pos1.z);
			
			// If the hero has traversed to the end of an edge
			// Connect the hero to the next node
			if (scope.movementPercentage <= 0.0)
				scope.connectedObject = edge.node1;
			else if (scope.movementPercentage >= 1.0)
				scope.connectedObject = edge.node2;
		}
		else
			throw "ERROR: Hero is connected to unknown object type";

	}
	
	// Moves the Hero onto the best Edge
	// @remark Best is the one with the smallest y (go downhill)
	// @assumes connectedObject is a node with at least one edge
	scope.decideNextEdge = function() {
		var currentNode = scope.connectedObject;
		var edges = currentNode.edges;
		
		var bestEdge = null;
		for (var i=0; i < edges.length; ++i)
		{
			var bestNode = null;
			if (bestEdge === null)
				bestNode = currentNode;
			else
				bestNode = bestEdge.getOtherNode(currentNode);
			
			var newNode = edges[i].getOtherNode(currentNode);
			
			var bestY = bestNode.getPosition().y;
			var newY = newNode.getPosition().y;
			
			// TODO: Account for moving direction?
			if ( newY < bestY)
				bestEdge = edges[i];
		}
		
		// Only go onto an edge if the nodes are not on a plateau
		if (bestEdge !== null)
		{
			scope.movementDirection = bestEdge.getMovementDirection(currentNode);
			
			// choose the starting distance
			if (currentNode.getID() === bestEdge.node1.getID())
				scope.movementPercentage = 0.0;
			else
				scope.movementPercentage = 1.0;
			
			scope.connectedObject = bestEdge;
		}
	}
	
	scope.currentAnimateTheta = 0;
	scope.animate = function()
	{
		scope.updateLocation();
		
		scope.cube.rotation.x = ( scope.currentAnimateTheta * 180 ) * Math.PI / 180;
		scope.cube.rotation.y = ( scope.currentAnimateTheta * 360 ) * Math.PI / 180;
		scope.cube.rotation.z = ( scope.currentAnimateTheta * 360 ) * Math.PI / 180;

		scope.currentAnimateTheta  = (scope.currentAnimateTheta +=0.01)%(2*Math.PI);
	}
	
	return scope;
}