var LEVEL_WIDTH = 11,
	  LEVEL_DEPTH = 11;

var WORLD_START = {	x: 0,
					 	y: 0,
						z: 0};

var WORLD_END = {		x: CUBE_WIDTH*LEVEL_WIDTH,
				   		y: CUBE_WIDTH,
				  		z: -CUBE_WIDTH*LEVEL_WIDTH};

var WORLD_CENTER = {	x: CUBE_WIDTH*LEVEL_WIDTH/2.0,
				   		y: CUBE_WIDTH,
				   		z: -CUBE_WIDTH*LEVEL_WIDTH/2.0};

var WORLD_OBJECT_TYPES = {
	NODE: 0,
	VOXEL: 1,
	EDGE: 2,
	HERO: 3
};

var World = function() {
	var scope = {};
	scope.cubes;
	scope.nodes;
	scope.edges;
	scope.hero = null;
	scope.currentGoalNode;
	
	scope.init = function(scene) {
		// set up the cube vars
		scope.cubes=[];
		scope.nodes=[];
		scope.edges=[];
		var cubes = scope.cubes;
		var nodes = scope.nodes;
		var edges = scope.edges;
		
		// Offsets the map so the start of the first cube is at (0,0, 0)
		// Since a position determines the center point of a voxel
		var base_x_offset = CUBE_WIDTH/2.0;
		var base_y_offset = -CUBE_WIDTH/2.0;
		var base_z_offset = -CUBE_WIDTH/2.0;
		
		// Create all the voxels and their corresponding nodes
		for (var i = 0 ; i < LEVEL_WIDTH; ++i)
		{
			var cube_row = [];
			var node_row = [];
			
			for (var j = 0; j < LEVEL_DEPTH; ++j)
			{
				var cube = new Voxel(scene, i*CUBE_WIDTH +base_x_offset, 
										CUBE_HEIGHT  +base_y_offset, 
										-j*CUBE_DEPTH+base_z_offset)
				cube.init();
				cube_row.push(cube);
				
				var node = new Node(scene, cube);
				node.init();
				node_row.push(node);		
			}
			
			cubes.push(cube_row);
			nodes.push(node_row);
		}
		
		// Create an array of edges that connects each node in a grid
		for (var i = 0; i < LEVEL_WIDTH; ++i)
		{
			for (var j = 0; j < LEVEL_DEPTH; ++j)
			{
				// Create horiz edge, if it isn't the last j node
				if (j < LEVEL_DEPTH - 1)
				{
					var node1 = nodes[i][j  ];
					var node2 = nodes[i][j+1];
					
					var edge = new Edge(scene, node1, node2);
					edge.init();
					edges.push(edge);						
				}
			
				// Create vert edge, if it isn't the last i node
				if (i < LEVEL_DEPTH - 1)
				{
					var node1 = nodes[i  ][j];
					var node2 = nodes[i+1][j];
					
					var edge = new Edge(scene, node1, node2);
					edge.init();
					edges.push(edge);						
				}
			} // eo for j
			
		} // eo for i
		
		// Create a hero and pick the first treasure node
		
		// TODO: Make lots of hero nodes of different colors?
		scope.hero = new HERO();
		scope.hero.init( WORLD.nodes[1][1] );
		scope.pickTreasureNode();
		
		scope.reset();
	}
	
	scope.reset = function() {
		// Clear score
		scope.hero.score = 0;
		UI.dialogs['score'].update(scope.hero.score);
		
		// Randomize nodes in the world
		for (var i = 0; i < LEVEL_WIDTH; ++i)
		{
			for (var j = 0; j < LEVEL_DEPTH; ++j)
			{
				var node = scope.nodes[i][j];
				var position = node.getPosition();
				position.y = Math.random() * node.max_height;
				node.updateEdges();
			}
		}
	}
	
	scope.pickTreasureNode = function() {
		var x=Math.floor(Math.random()*LEVEL_WIDTH)
		var y=Math.floor(Math.random()*LEVEL_DEPTH)
		
		// Clear the last goal if it exists
		if (typeof scope.currentGoalNode !== 'undefined')
			scope.currentGoalNode.setTreasureNode(false);
			
		scope.currentGoalNode = scope.nodes[x][y];
		scope.currentGoalNode.setTreasureNode(true);
	}
	
	scope.animate = function() {
		if (scope.hero !== null)
			scope.hero.animate();
	}
		
	return scope;
}