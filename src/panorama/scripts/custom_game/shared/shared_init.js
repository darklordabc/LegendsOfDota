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