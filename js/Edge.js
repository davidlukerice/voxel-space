
/// 
/// A connector of two nodes
///
var Edge = function(scene, node1, node2) {
	var scope = {};
	
	scope.geometry;
	scope.material
	scope.obj;
	scope.node1 = node1;
	scope.node2 = node2;
	
	scope.maxHeightDifference;
	
	scope.init = function()
	{
		var node1Pos = scope.node1.getPosition();
		var node2Pos = scope.node2.getPosition();
		
		scope.geometry = new THREE.Geometry();
		scope.geometry.vertices.push( vertex(node1Pos.x, node1Pos.y, node1Pos.z),
									  vertex(node2Pos.x, node2Pos.y, node2Pos.z));
		
		scope.geometry.dynamic = true;
		
		scope.material = new THREE.LineBasicMaterial( { color: node1.color.getHex(), linewidth: 5 } );	
		scope.obj = new THREE.Line(scope.geometry, scope.material ) ;
		scope.obj.OBJ_TYPE = WORLD_OBJECT_TYPES.EDGE;
		
		scope.maxHeightDifference = CUBE_WIDTH*0.5;
		
		// Create circular reference to get back to this object from sphere
		scope.obj.scope = scope;
		
		// add the line to the scene
		SCENE.add(scope.obj);
		
		scope.node1.registerEdge(scope);
		scope.node2.registerEdge(scope);
	}
	
	scope.getType = function()
	{
		return scope.obj.OBJ_TYPE;	
	}
	
	// Updates the position of the line depending on the current
	// node positions
	// @param master: which node takes precedence if the node becomes too high
	scope.update = function(master)
	{
		if (master.getID() !== scope.node1.getID()
			&& master.getID() !== scope.node2.getID())
			throw "Error: master node not connected to the edge";
		
		var node1Pos = scope.node1.getPosition();
		var node2Pos = scope.node2.getPosition();
		
		scope.geometry.vertices[0].position.x = node1Pos.x;
		scope.geometry.vertices[0].position.y = node1Pos.y;
		scope.geometry.vertices[0].position.z = node1Pos.z;
		
		scope.geometry.vertices[1].position.x = node2Pos.x;
		scope.geometry.vertices[1].position.y = node2Pos.y;
		scope.geometry.vertices[1].position.z = node2Pos.z;
		
		scope.geometry.__dirtyVertices = true;
		
		var difference = node1Pos.y - node2Pos.y;
		if ( Math.abs( difference ) > scope.maxHeightDifference)
		{
			var masterNodePosition = master.getPosition();
			var slaveNode = scope.getOtherNode(master);
			var slaveNodePosition = slaveNode.getPosition();
			var direction = 1;
			if (slaveNodePosition.y < masterNodePosition.y)
				direction = -1;
				
			var newY = masterNodePosition.y + scope.maxHeightDifference * direction;
			slaveNode.updatePosition({
				x: slaveNodePosition.x,
				y: newY,
				z: slaveNodePosition.z	
			});
		}
			
		//;
	}
	
	// Reterns connected node other than the one passed in
	// Used to get the node tha a node connects to
	scope.getOtherNode = function(node)
	{
		if (node.getID() === scope.node1.getID())
			return scope.node2;			
			
		return scope.node1;
	}
	
	// From the passed in node, tell which direction needs to be traveling
	// @return 1 if node is node1, -1 if node is node2
	scope.getMovementDirection = function(node)
	{
		if (node.getID() === scope.node1.getID())
			return 1;
			
		return -1;
	}
	
	return scope;
}