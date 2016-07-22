"use strict";

// Cleanup our shared vars
Game.shared = {};

// Hooks an events and fires for all the keys
Game.shared.hookAndFire = function(tableName, callback) {
    // Listen for phase changing information
    CustomNetTables.SubscribeNetTableListener(tableName, callback);

    // Grab the data
    var data = CustomNetTables.GetAllTableValues(tableName);
    for(var i=0; i<data.length; ++i) {
        var info = data[i];
        callback(tableName, info.key, info.value);
    }
}

// Hooks a change event for text boxes
Game.shared.addInputChangedEvent = function(panel, callback, extraInfo) {
	if(extraInfo == null) extraInfo = {};

    var shouldListen = false;
    var checkRate = 0.25;
    var currentString = panel.text;

    var inputChangedLoop = function() {
        // Check for a change
        if(currentString != panel.text) {
            // Update current string
            currentString = panel.text;

            // Run the callback
            callback(currentString);
        }

        if(shouldListen) {
            $.Schedule(checkRate, inputChangedLoop);
        }
    }

    panel.SetPanelEvent('onfocus', function() {
        // Enable listening, and monitor the field
        shouldListen = true;
        inputChangedLoop();

        // Extra events
        if(extraInfo.onfocus) extraInfo.onfocus();
    });

    panel.SetPanelEvent('onblur', function() {
        // No longer listen
        shouldListen = false;

        // Extra events
        if(extraInfo.onblur) extraInfo.onblur();
    });
}