var NODE_RADIUS = 5,
      NODE_SEGMENTS_WIDTH = 5,
	  NODE_SEMGENTS_HEIGHT = 5;

var Node = function(scene, voxel) {
	var scope = {};
	
	scope.voxel = voxel;
	
	scope.geometry;
	scope.sphereMaterial
	scope.sphere;
	scope.color;
	
	scope.edges = [];
	scope.min_height;
	scope.max_hegiht;
	
	scope.isTreasureNode = false;
	
	scope.init = function()
	{
		scope.geometry = new THREE.SphereGeometry( NODE_RADIUS, NODE_SEGMENTS_WIDTH, NODE_SEMGENTS_HEIGHT);
	
		scope.color = new THREE.Color();
		scope.color.setHSV( 0.52, 
							0.60, 
							0.50 + Math.random() * 0.30 );
		
		scope.sphereMaterial = new THREE.MeshLambertMaterial( { color: scope.color.getHex() } );	
		
		scope.sphere = new THREE.Mesh(scope.geometry, scope.sphereMaterial ) ;
		scope.sphere.OBJ_TYPE = WORLD_OBJECT_TYPES.NODE;
		
		// Create circular reference to get back to this object from sphere
		scope.sphere.scope = scope;
		
		var voxelPos = voxel.getPosition();
		
		scope.min_height = voxelPos.y + CUBE_HEIGHT/2.0;
		scope.max_height = voxelPos.y + CUBE_HEIGHT*5.0;
		
		scope.sphere.position.x = voxelPos.x;
		scope.sphere.position.y = scope.min_height;
		scope.sphere.position.z = voxelPos.z;
		
		scope.sphere.geometry.dynamic = true;
		
		// add the sphere to the scene
		SCENE.add(scope.sphere);
	}
	
	scope.getType = function()
	{
		return scope.sphere.OBJ_TYPE;	
	}
	
	scope.updatePosition = function(pos) 
	{
		//constrain to the height
		if (pos.y < scope.min_height)
			pos.y = scope.min_height;
		if (pos.y > scope.max_height)
			pos.y = scope.max_height;
		
		// If the same height, just return to save on edge calculations
		if (   pos.x === scope.sphere.position.x
			&& pos.y === scope.sphere.position.y
			&& pos.z === scope.sphere.position.z)
			return;
		
		scope.sphere.position.x = pos.x;
		scope.sphere.position.y = pos.y;
		scope.sphere.position.z = pos.z;	

		// TODO: But a little lower
		//scope.voxel.updatePosition(pos);
		scope.updateEdges(scope);
	}
	
	scope.getPosition = function()
	{
		return scope.sphere.position;
	}
	
	scope.getID = function()
	{
		var pos = scope.voxel.cube.position;
		return (pos.x-CUBE_WIDTH/2.0)/CUBE_WIDTH + "," + -(pos.z+CUBE_WIDTH/2.0)/CUBE_WIDTH;
	}
	// Registers an edge with this node so that it knows the edges connected to it 
	// and how to update it
	scope.registerEdge = function(edge)
	{
		//debug("Registering for: "+scope.getID());
		scope.edges.push(edge)	
	}
	
	scope.updateEdges = function()
	{
		var length = scope.edges.length;
		for (var i=0; i < length; ++i)
			scope.edges[i].update(scope);
	}
	
	// Set this node as a goal nodes
	scope.setTreasureNode = function(isTreasureNode)
	{
		scope.isTreasureNode = isTreasureNode;
		
		if (isTreasureNode)
		{
			scope.color.setHSV( 0.16, 
					0.60, 
					0.70 + Math.random() * 0.25 );
		}
		else
		{
			scope.color.setHSV( 0.52, 
					0.60, 
					0.50 + Math.random() * 0.30 );
		}
		
		scope.sphereMaterial.color = scope.color;

		// changes to the normals
		scope.sphere.geometry.__dirtyNormals = true;
	}
	
	return scope;
}