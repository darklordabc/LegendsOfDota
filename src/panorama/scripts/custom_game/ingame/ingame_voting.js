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
				des: 'votingGameplayDes',
				link: 'gameplay'
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
	gameplay: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			},
			{
				title: 'votingGameplayAddGold',
				des: 'votingGameplayAddGoldDes',
				confirmVote: true,
				back: 'gameplay'
			},
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
			},
			{
				title: 'votingGiveupCallDraw',
				des: 'votingGiveupCallDrawDes',
				confirmVote: true,
				back: 'giveup'
			}
		]
	}
};

// The ID of a vote we have hidden
var hiddenVote;
var activeVoteData;

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

// When we get ingame data
function OnGetIngameData(table_name, key, data) {
	if(key == 'vote') {
		OnGetVoteData(table_name, key, data);
		return;
	}
}

// When we get vote data
function OnGetVoteData(table_name, key, data) {
	var playerID = Players.GetLocalPlayer();
	var plyVotes = data.plyVotes;

	// Store it
	activeVoteData = data;

	// Show or hide the player vote counter
	var voteButtonsCon = $('#voteOptionsContainer');
	if(plyVotes[playerID] || data.finished) {
		voteButtonsCon.visible = false;
	} else {
		voteButtonsCon.visible = true;
	}

	// Hide finish messages
	$('#lodVotePassed').visible = false;
	$('#lodVoteFailed').visible = false;

	if(data.finished) {
		if(data.passed) {
			$('#lodVotePassed').visible = true;
		} else {
			$('#lodVoteFailed').visible = true;
		}
	}

	// Update vote counts
	$('#lodVoteCountYes').text = data.totalYes;
	$('#lodVoteCountNo').text = data.totalNo;

	// Update title
	$('#voteTitle').text = $.Localize(data.voteTitle);

	// Grab player name
	$('#voteBy').text = '';
	var plyInfo = Game.GetPlayerInfo(data.playerID);
	if(plyInfo != null) {
		var plyName = plyInfo.player_name;

		if(plyName != null) {
			$('#voteBy').text = $.Localize('voteCreatedBy').replace(/\{plyName\}/g, plyName)
		}
	}

	// Update description
	$('#voteDes').text = '';
	if(data.voteDes != null) {
		$('#voteDes').text = $.Localize(data.voteDes);
	}

	// Show it
	$('#votingActiveVote').visible = true;

	// Should we show it?
	if(data.hideTime) {
		var now = Game.Time();
		if(now > data.hideTime) {
			// Hide now
			$('#votingActiveVote').visible = false;
		} else {
			// Hide in a few moments
			var theVoteID = data.voteID;
			$.Schedule(data.hideTime - now, function() {
	            if(theVoteID == data.voteID) {
	            	$('#votingActiveVote').visible = false;
	            }
	        });
		}
	} else {
		if(hiddenVote == data.voteID) {
			$('#votingActiveVote').visible = false;
		}
	}
}

// Close the active vote panel
function closeActiveVotePanel() {
	// Hide it
	$('#votingActiveVote').visible = false;

	// Stop it from popping back up
	if(activeVoteData != null) {
		hiddenVote = activeVoteData.voteID;
	}
}

// Hook everything
(function() {
	// Define exports
	Game.shared.voting = {
		votingDisplayMenu: votingDisplayMenu,
		votingConfirmVote: votingConfirmVote
	}

	// Hook vote changes
	Game.shared.hookAndFire('phase_ingame', OnGetIngameData);

	// Show the main voting menu
	votingDisplayMenu('mainMenu');
})();