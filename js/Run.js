/*
  _____  _    _ _   _ _   _ _____ _   _  _____             _   _ _____  
 |  __ \| |  | | \ | | \ | |_   _| \ | |/ ____|      /\   | \ | |  __ \ 
 | |__) | |  | |  \| |  \| | | | |  \| | |  __      /  \  |  \| | |  | |
 |  _  /| |  | | . ` | . ` | | | | . ` | | |_ |    / /\ \ | . ` | |  | |
 | | \ \| |__| | |\  | |\  |_| |_| |\  | |__| |   / ____ \| |\  | |__| |
 |_|  \_\\____/|_| \_|_| \_|_____|_| \_|\_____|  /_/    \_\_| \_|_____/ 
  _    _ _____  _____       _______ _____ _   _  _____                  
 | |  | |  __ \|  __ \   /\|__   __|_   _| \ | |/ ____|                 
 | |  | | |__) | |  | | /  \  | |    | | |  \| | |  __                  
 | |  | |  ___/| |  | |/ /\ \ | |    | | | . ` | | |_ |                 
 | |__| | |    | |__| / ____ \| |   _| |_| |\  | |__| |                 
  \____/|_|    |_____/_/    \_\_|  |_____|_| \_|\_____|                                    
*/

/**
 * Runs the code in sequential order. The CSV MUST be parsed first, then the SQLite db is loaded
 * and parsed appropriately.
 */
 function run() {

  var i = 30;
  var origLoopTime = i.valueOf();

  // Add markers
  loadCSV('data/exampleAkipsStatus.csv') // load CSV first
    .then(() => loadSQLite('data/buildings.db')) // then load SQLite db (order is important for return result)
    .then(function (database) { // database = the returned promise from loadSQLite
      placeMarkerSQL(database);

      // Run update() every 60000ms (60 seconds).
      var int = setInterval(function () {
        // Update page HTML
        document.getElementById("updateTimerText").innerHTML = "Next update in: " + (i - 1) + " seconds";
        i--;

        // once the timer hits 0, update the map markers and restart the timer.
        if (i == 0) {
          update(database);
          i = origLoopTime;
        }
      }, 1000);

      // On button click, update the markers, reset the timer, and update the page information
      document.getElementById("updateTimerButton").onclick = function () {
        update(database);
        i = origLoopTime;
        document.getElementById("updateTimerText").innerHTML = "Next update in: " + (i - 1) + " seconds";
      };

      // Update information regarding ratio of good devices to total devices
      document.getElementById("tableButton").innerHTML = "&raquo; " + goodDevices + "/"
        + (badDevices + goodDevices) + " (" + unkDevices + ")"

    })
    // Fill the network table with data
    .then(() => updateNetworkTable(csvData));

    console.log(csvData);
}

/**
 * Updates the map periodically.
 * 
 * @param {Array} db the SQLite database.
 */
function update(db) {

  // Clear all existing markers
  markerGroup.clearLayers();
  // Clear existing status data
  csvData.clear();

  // Reset counters
  goodDevices = 0;
  badDevices = 0;
  unkDevices = 0;

  // // reload CSV data
  loadCSV('data/exampleAkipsStatus.csv')
    //   // place new markers
    .then(() => placeMarkerSQL(db))
    .then(() =>
    // update ratios of devices
    // Syntax: >> (good devices) / (total devices) (unknown devices)
      document.getElementById("tableButton").innerHTML = "&raquo; " + goodDevices + "/"
      + (badDevices + goodDevices) + " (" + unkDevices + ")"
    )
    // Update the network table with the latest data
    .then(() => updateNetworkTable(csvData))
}

// START
run();