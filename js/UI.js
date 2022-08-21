
var UserInterface = function() {
	var scope = {};
	
	// Holds all the dialogs that can be shown or hidden
	scope.dialogs = {};
	
	scope.init = function()
	{
		scope.dialogs["intro"] = scope.createIntroDialog();
		scope.dialogs["help"] = scope.createHelpDialog();
		scope.dialogs["victory"] = scope.createVictoryDialog();
		scope.dialogs["score"] = scope.createScoreDialog();
		scope.dialogs["timer"] = scope.createTimerDialog();
		
		// Add all the created dialogs and hide them
		for (var index in scope.dialogs)
		{
			var dialog = scope.dialogs[index];
			$('body').append(dialog);
			dialog.hide();	
		}
	}
	
	scope.createDialog = function(id) {
		var dialog = $(	"<div class='dialog' id='"+id+"'  />");
		return dialog;
	}	
	
	/// For the Intro State
	scope.createIntroDialog = function() {		
		var dialog =  scope.createDialog('intro_dialog')
						.append("<h1>Voxel Space</h1>");
						
		var helpDiv = $("<div class='dialog_option'> How to Play </div>");
		
		var startDiv = $("<div class='dialog_option'> Start Game </div>");
			
		dialog.append(helpDiv)
			  .append(startDiv);
		
		helpDiv.click(function(e){
			STATE_MANAGER.enterState(STATES.HELP);
		});
		
		startDiv.click(function(e){
			STATE_MANAGER.enterState(STATES.GAME);
		});
		return dialog;
	}
	scope.showIntroScreen = function() {
		scope.dialogs["intro"].fadeIn();
	}
	scope.hideIntroScreen = function() {
		scope.dialogs["intro"].fadeOut();
	}
	
	/// For the Help State
	scope.createHelpDialog = function() {		
		var dialog =  scope.createDialog('help_dialog')
						.append("<h1>How to Play</h1>");
						
		var helpDiv = $("<div class='info'> Click and drag a graph node "
						+"to raise or lower them to guide "
						+"the hero to collect as many treasures in the time limit!<br />"
						+"'wasd' or mouse to move the camera</div>");
		
		var backDiv = $("<div class='dialog_option'> Back </div>");
			
		dialog.append(helpDiv)
			  .append(backDiv);
		
		backDiv.click(function(e){
			STATE_MANAGER.enterState(STATES.INTRO);
		});
		return dialog;
	}
	scope.showHelpScreen = function() {
		scope.dialogs["help"].fadeIn();
	}
	scope.hideHelpScreen = function() {
		scope.dialogs["help"].fadeOut();
	}
	
	/// For the Game State
	scope.createScoreDialog = function() {
		var dialog = scope.createDialog('score_dialog')
							.append("Score: ");
		
		var scoreContainer = $("<span> </ span>");
		dialog.append(scoreContainer);
		
		dialog.update = function(newScore)
		{
			//TODO: Animate change of score?
			scoreContainer.html(""+newScore);
		}
		
		return dialog;
	}
	scope.createTimerDialog = function() {
		var dialog =  scope.createDialog('timer_dialog')
						.append("Time Left: ");
		
		var timeContainer = $("<span> </ span>");
		dialog.append(timeContainer);
		
		dialog.update = function(newTime)
		{
			//TODO: Animate change of time? (maybe just last 10 seconds?)
			timeContainer.html(""+newTime+" seconds");
		}
		
		return dialog;
	}
	scope.showGameScreen = function(score) {
		scope.dialogs["score"].fadeIn();
		scope.dialogs["timer"].fadeIn();
	}
	scope.hideGameScreen = function() {
		scope.dialogs["score"].fadeOut();
		scope.dialogs["timer"].fadeOut();
	}
	
	/// For the Victory State
	scope.createVictoryDialog = function( ) {
		var dialog =  scope.createDialog('victory_dialog')
						.append("<h1>Finished!</h1>");
		var fullScoreContainer = $("</div><div>Your score was:<div>");
		dialog.scoreContainer = $("<span> </ span>");
		fullScoreContainer.append(dialog.scoreContainer);	
		dialog.append(fullScoreContainer);
		
		var continueContainer = $("<div class='dialog_option'>Continue</div>");
		
		dialog.append(continueContainer);
		
		continueContainer.click(function(e){
			STATE_MANAGER.enterState(STATES.INTRO);
		});
		
		return dialog;
	}
	scope.showVictoryScreen = function(score) {
		scope.dialogs["victory"].scoreContainer.html(""+score);
		scope.dialogs["victory"].fadeIn();
	}
	scope.hideVictoryScreen = function() {
		scope.dialogs["victory"].fadeOut();
	}
	
	return scope;
}