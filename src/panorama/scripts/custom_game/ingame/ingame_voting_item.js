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

	// Should we close the window?
	if(ourInfo.close) {
		Game.shared.voting.votingHideCreationMenu();
	}
}

// Adds a slider to the panel
function addSliderInput(sliderStep, sliderMin, sliderMax, sliderDefault, callback) {
	var con = $('#votingItemSlider');

	var sliderPanelCon = $.CreatePanel('Panel', con, 'votingItemSliderInside');
	sliderPanelCon.BLoadLayout('file://{resources}/layout/custom_game/shared/ui/slider.xml', false, false);

	// When the value is changed
    sliderPanelCon.onComplete(function(newValue) {
        callback(newValue);
    });

    // When the value changes
    sliderPanelCon.onChange(function(newValue) {
        callback(newValue);
    });

    // Init
    sliderPanelCon.initSlider(sliderStep, sliderMin, sliderMax, sliderDefault);
}

// Stores the text
var noText = '';
var yesText = '';

// Adds the "yes" / "no" toggle thingo
function addToggleInput(defaultValue, noTextNew, yesTextNew, callback) {
    // Make the toggler visible
    $('#votingItemToggle').visible = true;

    // Store the text
    noText = noTextNew;
    yesText = yesTextNew;

    // Set the default value
    $('#votingItemToggleToggler').checked = defaultValue == 1;

    // Update the toggler text
    updateTogglerText();

    // Add the callback
    $('#votingItemToggleToggler').SetPanelEvent('onactivate', function() {
        var checked = $('#votingItemToggleToggler').checked;
        var checkedValue = 1;
        if(!checked) checkedValue = 0;

        // Run the callback
        callback(checkedValue);

        // Update the text
        updateTogglerText();
    });
}

function updateTogglerText() {
    var toggler = $('#votingItemToggleToggler');

    var msg = '';
    if(toggler.checked) {
        toggler.text = yesText;
    } else {
        toggler.text = noText;
    }
}

// Do stuff
(function() {
	// Grab the main panel
    var mainPanel = $.GetContextPanel();

    // Define exports
    mainPanel.parseInfo = parseInfo;
    mainPanel.addSliderInput = addSliderInput;
    mainPanel.addToggleInput = addToggleInput;
})();