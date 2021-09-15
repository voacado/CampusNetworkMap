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

  // Store the original time so we can re-use it.
  var origLoopTime = refreshTimerinSeconds.valueOf();

  // Add markers
  loadCSV(akipsDataPath) // load CSV first
    .then(() => loadSQLite(databasePath)) // then load SQLite db (order is important for return result)
    .then(function (database) { // database = the returned promise from loadSQLite
      placeMarkerSQL(database);

      // Run update() every 60000ms (60 seconds).
      var int = setInterval(function () {
        // Update page HTML
        document.getElementById("updateTimerText").innerHTML = "Next update in: " + (refreshTimerinSeconds - 1) + " seconds";
        refreshTimerinSeconds--;

        // once the timer hits 0, update the map markers and restart the timer.
        if (refreshTimerinSeconds == 0) {
          update(database);
          refreshTimerinSeconds = origLoopTime;
        }
      }, 1000);

      // On button click, update the markers, reset the timer, and update the page information
      document.getElementById("updateTimerButton").onclick = function () {
        update(database);
        refreshTimerinSeconds = origLoopTime;
        document.getElementById("updateTimerText").innerHTML = "Next update in: " + (refreshTimerinSeconds - 1) + " seconds";
      };

      // Update information regarding ratio of good devices to total devices
      document.getElementById("tableButton").innerHTML = "&raquo; " + goodDevices + "/"
        + (badDevices + goodDevices) + " working<br>(" + unkDevices + " unknown)"

    })
    // Fill the network table with data
    .then(() => updateNetworkTable(csvData))
    .then(() => updateNetworkErrorTable(errorData))
    // Start the network table visualization with only "Down" devices.
    .then(() => toggleUpVisiblity())
    // Add the table visual function to the button after the website has loaded.
    .then(() => document.getElementById("tableButton").onclick = function () {
      showNetworkTable();
    })
    // Add onclick for show/hide button in table visualization to condense information.
    .then(() => document.getElementById("showHideWorkingButton").onclick = function () {
      toggleUpVisiblity();
    });

  // TODO: should assigning onclicks go in .then() or in window.onload()? does it matter?
}

/**
 * Updates the map periodically.
 * 
 * @param {Array} db the SQLite database.
 */
function update(db) {

  // Clear all existing markers
  markerGroup.clearLayers();
  // Clear existing status and error data
  csvData.clear();
  errorData.length = 0;

  // Reset counters
  goodDevices = 0;
  badDevices = 0;
  unkDevices = 0;

  // // reload CSV data
  loadCSV(akipsDataPath)
    //   // place new markers
    .then(() => placeMarkerSQL(db))
    .then(() =>
      // update ratios of devices
      // Syntax: >> (good devices) / (total devices) (unknown devices)
      document.getElementById("tableButton").innerHTML = "&raquo; " + goodDevices + "/"
      + (badDevices + goodDevices) + " working<br>(" + unkDevices + " unknown)"
    )
    // Update the network table with the latest data
    .then(() => updateNetworkTable(csvData))
    .then(() => updateNetworkErrorTable(errorData));
}

// START
run();