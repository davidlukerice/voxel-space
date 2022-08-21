var CUBE_WIDTH = 20, 
	  CUBE_HEIGHT = 20, 
	  CUBE_DEPTH = 20;

var Voxel = function(scene, x, y, z) {
	var scope = {};
	
	scope.geometry;
	scope.cubeMaterial
	scope.cube;
	scope.color;
	
	scope.init = function()
	{
		scope.geometry = new THREE.CubeGeometry( CUBE_WIDTH, CUBE_HEIGHT, CUBE_DEPTH);
		
		scope.color = new THREE.Color();
		scope.color.setHSV( 0.34, 
							0.6, 
							0.15 + Math.random() * 0.25 );
		
		scope.cubeMaterial = new THREE.MeshLambertMaterial( { color: scope.color.getHex() } );

		scope.cube = new THREE.Mesh(scope.geometry, scope.cubeMaterial ) ;
		scope.cube.position.x = x;
		scope.cube.position.y = y;
		scope.cube.position.z = z;
		scope.cube.OBJ_TYPE = WORLD_OBJECT_TYPES.VOXEL;
		// Create circular reference to get back to this object from cube
		scope.cube.scope = scope;
		
		// add the sphere to the scene
		SCENE.add(scope.cube);
	}
	
	scope.getType = function()
	{
		return scope.cube.OBJ_TYPE;	
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
	
	return scope;
}