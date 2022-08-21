
///
/// Manages transition between the different states of the game
///
var STATES = {
	INTRO: 0,
	HELP: 1,
	GAME:2,
	VICTORY:3
}
var StateManager = function() {
	var scope = {};
	
	scope.states = [];
	scope.currentStateIndex = 0;
	
	scope.init = function()
	{
		scope.states.push(new scope.introState());
		scope.states.push(new scope.helpState());
		scope.states.push(new scope.gameState());
		scope.states.push(new scope.victoryState());
		scope.enterState(STATES.INTRO);
	}
	
	scope.enterState = function(index)
	{
		scope.states[scope.currentStateIndex].exitState();
		scope.currentStateIndex = index;
		scope.states[scope.currentStateIndex].enterState();
	}
	
	scope.updateCurrentState = function()
	{
		scope.states[scope.currentStateIndex].updateState();
	}
	
	scope.introState = function()
	{
		var scope = {};
		scope.enterState = function()
		{
			UI.showIntroScreen();
		}
		scope.exitState = function()
		{
			UI.hideIntroScreen();
		}
		scope.updateState = function()
		{
			INPUT_CHAIN.targetCameraMovement.x+=-0.005;
		}
		return scope;
	}
	
	scope.helpState = function()
	{
		var scope = {};
		scope.enterState = function()
		{
			UI.showHelpScreen();
		}
		scope.exitState = function()
		{
			UI.hideHelpScreen();
		}
		scope.updateState = function()
		{
			INPUT_CHAIN.targetCameraMovement.x+=-0.005;
		}
		return scope;
	}
	
	scope.gameState = function()
	{
		var scope = {};
		scope.GAME_TIME = 60;
		scope.gameStartTime;
		scope.DATE = new Date();
		scope.enterState = function()
		{
			scope.gameStartTime = +new Date;
			
			WORLD.reset();
	
			INPUT_CHAIN.startPlayerInteraction();
			
			UI.showGameScreen();
		}
		scope.exitState = function()
		{
			INPUT_CHAIN.stopPlayerInteraction();
			UI.hideGameScreen();
		}
		scope.updateState = function()
		{
			// check time clock
			var timeDifference = parseInt( ( (+new Date) - scope.gameStartTime) / 1000 , 10);
			var timeLeft = scope.GAME_TIME - timeDifference;
			if (timeLeft > 0)
				UI.dialogs['timer'].update(timeLeft);
			else {
				STATE_MANAGER.enterState(STATES.VICTORY);
			}		
		}
		return scope;
	}
	
	scope.victoryState = function()
	{
		var scope = {};
		scope.enterState = function()
		{
			UI.showVictoryScreen(WORLD.hero.score);
		}
		scope.exitState = function()
		{
			UI.hideVictoryScreen(WORLD.hero.score);
		}
		scope.updateState = function()
		{
			INPUT_CHAIN.targetCameraMovement.x+=-0.005;
		}
		return scope;
	}
	return scope;
}