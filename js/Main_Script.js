
var CONTAINER;
var RENDERER, SCENE;
var STATS;
var WORLD;
var INPUT_CHAIN;
var UI;
var STATE_MANAGER;

$(document).ready(function(e) {
    init();
	animate();
});

// Start the game
function init() {
	
	CONTAINER = $('#container');
	
	UI = new UserInterface();
	UI.init();
	
	SCENE = new THREE.Scene();
	
	WORLD = World();
	WORLD.init(SCENE);
	
	ASPECT = CONTAINER.width() / CONTAINER.height();
	
	// How the game handles input
	INPUT_CHAIN = InputChain();
	INPUT_CHAIN.init(SCENE);
	
	// create 4 point lights around the WORLD
	var pLight = new THREE.PointLight(0xffffff);
	pLight.position.set(WORLD_START.x-20, 110, WORLD_START.z+20);
	SCENE.add(pLight);
	
	pLight = new THREE.PointLight(0xffffff);
	pLight.position.set(WORLD_END.x+20, 110, WORLD_END.z-20);
	SCENE.add(pLight);

	pLight = new THREE.PointLight(0xffffff);
	pLight.position.set(WORLD_START.x-20, 110, WORLD_END.z-20);
	SCENE.add(pLight);
	
	pLight = new THREE.PointLight(0xffffff);
	pLight.position.set(WORLD_END.x+20, 110, WORLD_START.z+20);
	SCENE.add(pLight);

	RENDERER = new THREE.WebGLRenderer();
	// start the RENDERER
	RENDERER.setSize(CONTAINER.width(), CONTAINER.height());
	$(window).resize(function(e) {
        RENDERER.setSize(CONTAINER.width(), CONTAINER.height());
		ASPECT = CONTAINER.width() / CONTAINER.height();
    });
	
	// attach the render-supplied DOM element
	CONTAINER.append(RENDERER.domElement);
	
	if (DEBUG_ON)
	{
		STATS = new Stats();
		STATS.domElement.style.position = 'absolute';
		STATS.domElement.style.top  = '80px';
		STATS.domElement.style.left = '35px';
		CONTAINER.append( STATS.domElement );		
	}

	STATE_MANAGER = new StateManager();
	STATE_MANAGER.init();
}

function animate() {
	requestAnimationFrame( animate );
	STATE_MANAGER.updateCurrentState();
	
	WORLD.animate();
	INPUT_CHAIN.update();
	render();
	
	if (DEBUG_ON)
		STATS.update();
}

function render() {
	RENDERER.render(SCENE, INPUT_CHAIN.camera);
}
