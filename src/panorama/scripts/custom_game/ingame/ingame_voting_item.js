"use strict";

// Stores our info
var ourInfo;

// We are being passed our info
function parseInfo(newInfo) {
	// Store the new info
	ourInfo = newInfo;

	// Update the elements
	$('#votingItemTitle').text = $.Localize(ourInfo.title);
	$('#votingItemDes').text = $.Localize(ourInfo.des);
}

// When this item is pressed
function onVoteOptionPressed() {
	// Do we have a link?
	if(ourInfo.link) {
		// Change menus
		Game.shared.voting.votingDisplayMenu(ourInfo.link);
		return;
	}

	// Should we try to confirm the vote?
	if(ourInfo.confirmVote) {
		Game.shared.voting.votingConfirmVote(ourInfo);
		return;
	}

	// Do we have a callback?
	if(ourInfo.callback) {
		ourInfo.callback(ourInfo);
		return;
	}
}

// Do stuff
(function() {
	// Grab the main panel
    var mainPanel = $.GetContextPanel();

    // Define exports
    mainPanel.parseInfo = parseInfo;
})();