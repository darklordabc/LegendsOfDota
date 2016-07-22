"use strict";

// Containers for our callbacks
var sliderChangedHooks = [];
var sliderCompletedHooks = [];

var sliderStep = 1;
var sliderMin = 1;
var sliderMax = 2;
var sliderDefault = 1;

// Sets up teh slider
function initSlider(newSliderStep, newSliderMin, newSliderMax, newSliderDefault) {
	// Store vars
	sliderStep = newSliderStep;
	sliderMin = newSliderMin;
	sliderMax = newSliderMax;
	sliderDefault = newSliderDefault;

	// Update the slider
	var mainCon = $.GetContextPanel();
	var sliderPanel = mainCon.FindChildInLayoutFile('slider');
	var textPanel = mainCon.FindChildInLayoutFile('entry');

    sliderPanel.min = sliderMin;
    sliderPanel.max = sliderMax;
    sliderPanel.increment = sliderStep;
    sliderPanel.value = sliderDefault;
    sliderPanel.SetShowDefaultValue(true);

    // Change text
    textPanel.text = newSliderDefault;
}

// Sets the current value
function setCurrentValue(newValue) {
	var mainCon = $.GetContextPanel();
	var sliderPanel = mainCon.FindChildInLayoutFile('slider');
	var textPanel = mainCon.FindChildInLayoutFile('entry');

	// Do the change
	sliderPanel.value = newValue;
	textPanel.text = newValue;
}

// Fixes the current value
function fixCurrentValue(currentValue) {
	// Validate the new value
    currentValue = Math.floor(currentValue / sliderStep) * sliderStep;

    if(currentValue < sliderMin) {
        currentValue = sliderMin;
    }

    if(currentValue > sliderMax) {
        currentValue = sliderMax;
    }

    return currentValue;
}

function hookSliderChange() {
	var mainCon = $.GetContextPanel();
	var sliderPanel = mainCon.FindChildInLayoutFile('slider');
	var textPanel = mainCon.FindChildInLayoutFile('entry');

    var shouldListen = false;
    var checkRate = 0.03;
    var currentValue = sliderPanel.value;

    var ignoreSliderInput = false;

    var inputChangedLoop = function() {
        // Check for a change
        if(currentValue != sliderPanel.value && !ignoreSliderInput) {
            // Update current string
            currentValue = sliderPanel.value;

            // Fixup the current value
            var fixedValue = fixCurrentValue(currentValue);

            // Update text panel
            textPanel.text = fixedValue;

            // Run the callback
            for(var i=0; i<sliderChangedHooks.length; ++i) {
            	sliderChangedHooks[i](fixedValue);
            }
        }

        if(shouldListen) {
            $.Schedule(checkRate, inputChangedLoop);
        }
    }

    sliderPanel.SetPanelEvent('onmouseover', function() {
        // Enable listening, and monitor the field
        shouldListen = true;
        inputChangedLoop();
    });

    sliderPanel.SetPanelEvent('onmouseout', function() {
        // No longer listen
        shouldListen = false;

        // Check the value once more
        inputChangedLoop();

        if(ignoreSliderInput) return;

        // Update the current value
        var currentValue = sliderPanel.value;
        var fixedValue = fixCurrentValue(currentValue);
        sliderPanel.value = fixedValue;

        // Update text panel
        textPanel.text = fixedValue;

        // Run the callback
        for(var i=0; i<sliderCompletedHooks.length; ++i) {
        	sliderCompletedHooks[i](fixedValue);
        }
    });

    Game.shared.addInputChangedEvent(textPanel, function(newValue) {
        newValue = parseInt(newValue);
        if(isNaN(newValue)) {
            newValue = sliderMin;
        }

        // Fixed the value
        newValue = fixCurrentValue(newValue);

        // Change the slider
        sliderPanel.value = newValue;
    }, {
    	onfocus: function() {
    		ignoreSliderInput = true;
    	},
    	onblur: function() {
    		ignoreSliderInput = false;

    		var newValue = parseInt(textPanel.text);
	        if(isNaN(newValue)) {
	            newValue = sliderMin;
	        }

	        // Fixed the value
	        newValue = fixCurrentValue(newValue);

    		// Run the callback
	        for(var i=0; i<sliderCompletedHooks.length; ++i) {
	        	sliderCompletedHooks[i](newValue);
	        }
    	}
    });
}

// Do it
(function() {
	var mainCon = $.GetContextPanel();

	// When the slider changes
	mainCon.onChange = function(callback) {
		sliderChangedHooks.push(callback);
	}

	// When the slider finishes changing
	mainCon.onComplete = function(callback) {
		sliderCompletedHooks.push(callback);
	}

	// Export
	mainCon.initSlider = initSlider;
	mainCon.setCurrentValue = setCurrentValue;

	// Init slider monitor
	hookSliderChange();
})();