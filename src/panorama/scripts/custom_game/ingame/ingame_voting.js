"use strict";

// Stores all the voting menus
var votingMenus = {
	// The main voting menu
	mainMenu: {
		items: [
			{
				title: 'votingChangeOptions',
				des: 'votingChangeOptionsDes'
			},
			{
				title: 'votingBalanceTeams',
				des: 'votingBalanceTeamsDes',
				link: 'balanceTeams'
			},
			{
				title: 'votingGameplay',
				des: 'votingGameplayDes'
			},
			{
				title: 'votingGiveup',
				des: 'votingGiveupDes',
				link: 'giveup'
			}
		]
	},
	balanceTeams: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			}
		]
	},
	giveup: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			},
			{
				title: 'votingGiveupCallGG',
				des: 'votingGiveupCallGGDes',
				confirmVote: true,
				back: 'giveup'
			}

		]
	}
};

// When the user wants to open the voting menu
function onBtnOpenVoteSystemPressed() {
	// Toggles the creation menu
	votingToggleCreationMenu();
}

// Hides the votable options part
function hideActiveVoteOptions() {
	$('#voteOptionsContainer').visible = false;
}

// Shows teh votable options part
function showActiveVoteOptions() {
	$('#voteOptionsContainer').visible = true;
}

// When the user presses vote yes
function onBtnOpenVoteYesPressed() {
	$.Msg('yes');

	// Hide the voting buttons
	hideActiveVoteOptions();

	// Push the vote to the server
	GameEvents.SendCustomGameEventToServer('lodVoteCastVote', {
		vote: 'yes'
	});
}

// When the user presses vote no
function onBtnOpenVoteNoPressed() {
	$.Msg('no');

	// Hide the voting buttons
	hideActiveVoteOptions();

	// Push the vote to the server
	GameEvents.SendCustomGameEventToServer('lodVoteCastVote', {
		vote: 'no'
	});
}

// Toggles the voting menu
function votingToggleCreationMenu() {
	var pain = $('#votingVoteCreationMenu');

	if(pain.visible) {
		votingHideCreationMenu();
	} else {
		votingShowCreationMenu();
	}
}

// Hides the voting menu
function votingHideCreationMenu() {
	// Hide it
	$('#votingVoteCreationMenu').visible = false;
}

// Shows the voting menu
function votingShowCreationMenu() {
	// Reset to the main vote screen
	votingDisplayMenu('mainMenu');

	// Show it
	$('#votingVoteCreationMenu').visible = true;
}

// Clears out the vote creation menu
function votingClearMenu() {
	var panelVoteCreation = $('#votingVoteCreationMenu');

	// Delete children
	panelVoteCreation.RemoveAndDeleteChildren();
}

// Creates a sub menu
function votingAddSubMenu(info) {
	// Grab the main panel
	var panelVoteCreation = $('#votingVoteCreationMenu');

	// Create the new panel
	var pan = $.CreatePanel('Panel', panelVoteCreation, 'votingSubMenu_' + info.title);
    pan.BLoadLayout('file://{resources}/layout/custom_game/ingame/ingame_voting_item_basic.xml', false, false);
    pan.parseInfo(info);
}

// Displays a given menu
function votingDisplayMenu(menuName) {
	// Ensure the menu exists
	var info = votingMenus[menuName];
	if(!info) return;

	// Clear the current menu
	votingClearMenu();

	// Grab the items for this menu
	var items = info.items || [];

	// Create each item
	for(var i=0; i<items.length; ++i) {
		// Grab the item
		var item = items[i];

		// Add the sub menu
		votingAddSubMenu(item);
	}
}

// Displays a menu where you confirm a vote
function votingConfirmVote(info) {
	// Ensure we have some info
	if(info == null) return;

	// Clear the old menu
	votingClearMenu();

	// Add the cancel button
	votingAddSubMenu({
		title: 'votingCancelVote',
		des: 'votingCancelVoteDes',
		link: info.back
	});

	// Add the title card
	votingAddSubMenu({
		title: info.title,
		des: info.des
	});

	// Add the create vote option
	votingAddSubMenu({
		title: 'votingCreateVote',
		des: 'votingCreateVoteDes',
		callback: function(theInfo) {
			// Create the vote
			createVote(info);
		}
	});
}

// Creates a vote based on the given info
function createVote(info, data) {
	// Hide the menu
	votingHideCreationMenu();

	// Push the vote to the server
	GameEvents.SendCustomGameEventToServer('lodVoteCreate', {
		info: info,
		data: data
	});
}

// Hook everything
(function() {
	// Define exports
	Game.shared.voting = {
		votingDisplayMenu: votingDisplayMenu,
		votingConfirmVote: votingConfirmVote
	}

	// Show the main voting menu
	votingDisplayMenu('mainMenu');
})();