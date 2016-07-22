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

function addSliderInput(sliderStep, sliderMin, sliderMax, sliderDefault, callback) {
	var con = $('#votingItemSlider');

	var sliderPanelCon = $.CreatePanel('Panel', con, 'votingItemSliderInside');
	sliderPanelCon.BLoadLayout('file://{resources}/layout/custom_game/shared/ui/slider.xml', false, false);

	// When the value is changed
    sliderPanelCon.onComplete(function(newValue) {
        callback(newValue);
    });

    // Init
    sliderPanelCon.initSlider(sliderStep, sliderMin, sliderMax, sliderDefault);
}

// Do stuff
(function() {
	// Grab the main panel
    var mainPanel = $.GetContextPanel();

    // Define exports
    mainPanel.parseInfo = parseInfo;
    mainPanel.addSliderInput = addSliderInput;
})();