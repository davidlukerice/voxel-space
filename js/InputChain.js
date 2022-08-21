// set some CAMERA attributes
var VIEW_ANGLE = 45,
	ASPECT = 0.75,
	NEAR = 0.1,
	FAR = 10000;

var InputChain = function() {
	var scope = {};
	scope.projector;
	scope.scene;
	
	/** Camera fields **/
	scope.camera;
	
	scope.MAX_CAMERA_DISTANCE = CUBE_WIDTH*LEVEL_WIDTH*2;
	scope.MIN_CAMERA_DISTANCE = 30.0;
	
	scope.MAX_ANGLE_Y = 80.0 * Math.PI / 180.0;
	scope.MIN_ANGLE_Y = 20.0 * Math.PI / 180.0;
	
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	
	scope.cameraAngle = {	x: -30.0* Math.PI / 180.0,
						 	y:  60.0* Math.PI / 180.0};
	scope.cameraDistance = CUBE_WIDTH*LEVEL_WIDTH;
	
	scope.cameraLookPosition;
	
	
	scope.targetCameraMovement={ 		x: scope.cameraAngle.x,
										y: scope.cameraAngle.y,
										z: scope.cameraDistance };
	scope.targetCameraMovementOnDown={ 	x: scope.cameraAngle.x,
								 		y: scope.cameraAngle.y,
										z: scope.cameraDistance };
	
	scope.pointOnDown={x:0.0,
					   y:0.0,
					   z:0.0};
	
	/** Other Fields **/
	scope.keyboard = new THREEx.KeyboardState();
	scope.selectedNode = null;
	
	scope.init = function(scene) {
		scope.projector = new THREE.Projector();
		scope.scene = scene;
		
		scope.camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
									ASPECT,
									NEAR,
									FAR );
		
		scope.cameraLookPosition = { 
			x: WORLD_CENTER.x, 
			y: WORLD_CENTER.y + CUBE_HEIGHT, 
			z: WORLD_CENTER.z};
		
		scope.setCameraPositionFromAngle(scope.cameraAngle.x, scope.cameraDistance);
		scope.camera.lookAt( scope.cameraLookPosition );
		
		scope.scene.add( scope.camera );
		
		$('#container').mousewheel( scope.onMouseWheelChange);
		
		// Reset the camera's FOV when the window resizes
		$(window).resize(function(e) {
			scope.camera.aspect = ASPECT;
			scope.camera.updateProjectionMatrix();
		});
	}
	
	scope.startPlayerInteraction = function()
	{
		// Add in input event handlers
		$("#container").bind( 'mousedown', scope.onContainerMouseDown);
	}
	
	scope.stopPlayerInteraction = function()
	{
		// Add in input event handlers
		$("#container").unbind( 'mousedown', scope.onContainerMouseDown);
	}
	
	// Set the camera at the given angle (in radians)
	// @param angle x is horizontal angle
	//				y is verticle angle
	// @remark converts the given sperhical coordiantes to the x,y,z values
	scope.setCameraPositionFromAngle = function(angle, distance)
	{
		//TODO: update x and z with changes from angle.y
		scope.camera.position.x = scope.cameraLookPosition.x + Math.cos(angle.x)*Math.sin(angle.y)*distance;
		scope.camera.position.z = scope.cameraLookPosition.z + Math.sin(angle.x)*Math.sin(angle.y)*distance;
		scope.camera.position.y = scope.cameraLookPosition.y + Math.cos(-angle.y)*distance;
	}
	
	/** Mouse **/
	scope.onContainerMouseDown = function(event)
	{
		//debug("Mouse Down");
		
		event.preventDefault();

		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		scope.projector.unprojectVector( vector, scope.camera );

		var ray = new THREE.Ray( scope.camera.position, vector.subSelf( scope.camera.position ).normalize() );

		var intersects = ray.intersectObjects( scope.scene.children );
		
		if ( intersects.length > 0 ) {
			
			// Find the first node intersected with
			for (var i=0; i < intersects.length && scope.selectedNode===null; ++i)
			{
				var obj = intersects[0].object;
				if (typeof obj.OBJ_TYPE !== 'undefined'
					&& obj.OBJ_TYPE === WORLD_OBJECT_TYPES.NODE)
				{
					scope.selectedNode = obj.scope;
					//debug("Node Selected: " + obj.scope.getID() );
				}				
			}
			
		}
		
		scope.pointOnDown.x = event.clientX - windowHalfX;
		scope.targetCameraMovementOnDown.x = scope.targetCameraMovement.x;
		
		scope.pointOnDown.y = event.clientY - windowHalfY;
		scope.targetCameraMovementOnDown.y = scope.targetCameraMovement.y;
		
		$('#container').bind( 'mouseup', scope.onContainerMouseUp);
		$('#container').bind( 'mousemove', scope.onContainerMouseMove);
		$('#container').bind( 'mouseout', scope.onContainerMouseOut);
	}
	
	scope.lastMouseMoveY = null;
	scope.onContainerMouseMove = function(event)
	{
		var mouseX = event.clientX - windowHalfX;
		var mouseY = event.clientY - windowHalfY;
		
		// Move the node if one was selected
		if (scope.selectedNode !== null)
		{
			var position = scope.selectedNode.getPosition();
			
			var newVector = vector3(position.x, position.y, position.z);
			var change = 0;
			if (scope.lastMouseMoveY !== null)
				change = ( mouseY - scope.lastMouseMoveY )* 0.15;
			else
				change = ( mouseY - scope.pointOnDown.y )* 0.15;
			
			newVector.y-= change;
			
			scope.selectedNode.updatePosition(newVector);
		}
		// otherwise, move the camera
		else {
			scope.targetCameraMovement.x = scope.targetCameraMovementOnDown.x + ( mouseX - scope.pointOnDown.x ) * 0.005;
			scope.targetCameraMovement.y = scope.targetCameraMovementOnDown.y - ( mouseY - scope.pointOnDown.y ) * 0.005;
			scope.constraingY();		
		}
		
		scope.lastMouseMoveY = mouseY;
	}
	
	scope.onContainerMouseUp = function(event)
	{
		scope.selectedNode = null;
		scope.lastMouseMoveY = null;
		$('#container').unbind( 'mousemove', scope.onContainerMouseMove);
		$('#container').unbind( 'mouseup', scope.onContainerMouseUp);
		$('#container').unbind( 'mouseout', scope.onContainerMouseOut);
	}

	scope.onContainerMouseOut = function( event ) {
		scope.selectedNode = null;
		scope.lastMouseMoveY = null;
		$('#container').unbind( 'mousemove', scope.onContainerMouseMove);
		$('#container').unbind( 'mouseup', scope.onContainerMouseUp);
		$('#container').unbind( 'mouseout', scope.onContainerMouseOut);
	}
	
	scope.onMouseWheelChange = function(event, delta) {		
			
		var temp = scope.targetCameraMovement.z - delta*50;
		if (temp < scope.MIN_CAMERA_DISTANCE) 
			temp = scope.MIN_CAMERA_DISTANCE;
		else if (temp > scope.MAX_CAMERA_DISTANCE ) 
			temp = scope.MAX_CAMERA_DISTANCE;
			
		scope.targetCameraMovement.z = temp;
	}
	
	scope.keyboardMovementSpeed = 0.05;
	scope.checkKeyboardActions = function() 
	{
		/// USE wasd to move the camera
		
		if ( scope.keyboard.pressed('a') )
			scope.targetCameraMovement.x+=scope.keyboardMovementSpeed;
		if ( scope.keyboard.pressed('d') )
			scope.targetCameraMovement.x-=scope.keyboardMovementSpeed;
		if ( scope.keyboard.pressed('w') )
			scope.targetCameraMovement.y-=scope.keyboardMovementSpeed;
		if ( scope.keyboard.pressed('s') )
			scope.targetCameraMovement.y+=scope.keyboardMovementSpeed;
			
		scope.constraingY();
	}
	
	scope.constraingY = function()
	{
		if (scope.targetCameraMovement.y > scope.MAX_ANGLE_Y)
			scope.targetCameraMovement.y = scope.MAX_ANGLE_Y
		if (scope.targetCameraMovement.y < scope.MIN_ANGLE_Y)
			scope.targetCameraMovement.y = scope.MIN_ANGLE_Y
	}
	
	scope.update = function()
	{
		scope.checkKeyboardActions();
		
		scope.cameraAngle.x += (scope.targetCameraMovement.x - scope.cameraAngle.x) * 0.1;
		scope.cameraAngle.y += (scope.targetCameraMovement.y - scope.cameraAngle.y) * 0.1;
		// constrain y
		if (scope.cameraAngle.y > scope.MAX_ANGLE_Y)
			scope.cameraAngle.y = scope.MAX_ANGLE_Y
		if (scope.cameraAngle.y < scope.MIN_ANGLE_Y)
			scope.cameraAngle.y = scope.MIN_ANGLE_Y
		
		scope.cameraDistance += (scope.targetCameraMovement.z - scope.cameraDistance) * 0.1;
		scope.setCameraPositionFromAngle( scope.cameraAngle, scope.cameraDistance );
		
		scope.camera.lookAt( scope.cameraLookPosition );
	}
	
	return scope;
}