/**
* Places markers on the map based on the status of the network hardware.
* 
* A green checkmark indicates it is up and running.
* A red X indicates hardware is unreachable.
* 
* The data is read from a CSV file and parsed appropriately.
* The format of the CSV file is as follows: Name, x-coordinate, y-coordinate, status.
* 
* TODO: parse extra information into bullet-point pop
*/

/*
  _____ _____ ____  _   _  _____ 
 |_   _/ ____/ __ \| \ | |/ ____|
   | || |   | |  | |  \| | (___  
   | || |   | |  | | . ` |\___ \ 
  _| || |___| |__| | |\  |____) |
 |_____\_____\____/|_| \_|_____/                                                
*/

/**
* Base Icon template - svg icons are sized as 20x20.
*/
var StatusIcon = L.Icon.extend({
  options: {
    iconUrl: 'images/check-mark.svg',
    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
  }
});

/**
* Good icon representing a functional network device. To be used as a marker icon.
*/
var goodIcon = new StatusIcon({ iconUrl: "images/check-mark.svg" });
/**
 * Bad icon representing a non-responsive network device. To be used as a marker icon.
 */
var badIcon = new StatusIcon({ iconUrl: "images/x-mark.svg" });
/**
 * Unknown icon representing an unknown device (ex. missing building code). To be used as a marker icon.
 */
var unknownIcon = new StatusIcon({ iconUrl: "images/unknown.svg" });

/*
  _      ____          _____ _____ _   _  _____    _____       _______       
 | |    / __ \   /\   |  __ \_   _| \ | |/ ____|  |  __ \   /\|__   __|/\    
 | |   | |  | | /  \  | |  | || | |  \| | |  __   | |  | | /  \  | |  /  \   
 | |   | |  | |/ /\ \ | |  | || | | . ` | | |_ |  | |  | |/ /\ \ | | / /\ \  
 | |___| |__| / ____ \| |__| || |_| |\  | |__| |  | |__| / ____ \| |/ ____ \ 
 |______\____/_/    \_\_____/_____|_| \_|\_____|  |_____/_/    \_\_/_/    \_\                                                         
*/

/** 
 * Map of network devices and their statuses.
 * The format of the map is: key=Device, value=data
 */
var csvData = new Map();

/**
 * List of markers placed onto the map.
 */
var markerGroup = L.layerGroup().addTo(map);

/**
* loadCSV() takes in the directory of the CSV file and stores the data
* into a map called csvData.
* 
* Parse CSV (containing network data) using Papa Parse into an array.
* Papa.parse creates an object with 3 elements: data, errors, and meta.
* The data is an array of Objects that represents each row of the CSV.
*
* @param {String} location the file location of the CSV file.
*/
function loadCSV(location) {
  // Promise determines if the function has finished running yet.
  return new Promise(function (resolve, reject) {

    Papa.parse(location, {
      header: true,
      download: true,
      dynamicTyping: true,
      step: function (row) {
        // Create a Map of the CSV as:
        // key = Building Code (ex. RY)
        // value = list of objects representing each network device for said code

        // if the Building Code key already exists, add it to the list,
        // otherwise create a new list.
        if (csvData.has(row.data.Code)) {
          // for clarity sake, all keys are converted into strings (including integers)
          csvData.get(String(row.data.Code)).push(row.data);
        } else {
          csvData.set(String(row.data.Code), new Array(row.data));
        }
      },
      complete: function (results) {
        resolve('Parse CSV done.') // Resolve = done and promise fulfilled.
      }
    });
  })
}

/**
 * Load a SQLite file from path.
 * 
 * loadSQLite utilizes sql.js functionality in order to mimick SQLite functionality
 * in JS. It creates a var db database that can be accessed using .exec with SQL
 * functions.
 * 
 * @param {String} path the location of the SQLite file.
 */
function loadSQLite(path) {
  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'arraybuffer';

    // once the file has been loaded, create the array (database) and return it (resolve)
    xhr.onload = function () {
      const uInt8Array = new Uint8Array(xhr.response);
      resolve(new SQL.Database(uInt8Array)); // Resolve = done and promise fulfilled.
    };

    xhr.onerror = reject; // if something wrong happens, return an error for promise
    xhr.send();
  })
}

/*
  __  __          _____     __  __          _____  _  ________ _____   _____ 
 |  \/  |   /\   |  __ \   |  \/  |   /\   |  __ \| |/ /  ____|  __ \ / ____|
 | \  / |  /  \  | |__) |  | \  / |  /  \  | |__) | ' /| |__  | |__) | (___  
 | |\/| | / /\ \ |  ___/   | |\/| | / /\ \ |  _  /|  < |  __| |  _  / \___ \ 
 | |  | |/ ____ \| |       | |  | |/ ____ \| | \ \| . \| |____| | \ \ ____) |
 |_|  |_/_/    \_\_|       |_|  |_/_/    \_\_|  \_\_|\_\______|_|  \_\_____/ 
*/

/**
 * Places the network data as nodes onto the marker group (which is placed onto the map).
 * 
 * @param {Array} db the database containing network data.
 */
function placeMarkerSQL(db) {
  // .exec stores the result in an array of objects (numbered 0 to ...)
  const contents = db.exec("SELECT * FROM BuildingCodes");
  // this object contains two arrays: columns and values
  var data = contents[0].values;

  // Array Key:
  // 0 - Title, 1 - Latitude, 2 - Longitude, 3 - Codes
  for (var i in data) {
    var row = data[i];
    var marker = L.marker([row[1], row[2]],
      { icon: determineIcon(row[3]) }) // icon is good if all network devices are on for "x" building
      .bindPopup(row[0])
      .addTo(markerGroup);
  }
}

/**
 * Determines the icon to display for a building based on the state of the network devices 
 * in said building.
 * 
 * @param {String} listOfDevices a string of all the building codes associated with said building.
 * @returns the icon to use for the node on the map.
 */
function determineIcon(listOfDevices) {
  // Nullity check: if building does not have a building code, return unknown icon (orange dash)
  if (listOfDevices == null) {
    return unknownIcon;
  }

  // Split the list of devices (comma-delimited, auto-trims extra spaces)
  // Example: 142, 144, 146, 148 -> [142, 144, 146, 148]
  var buildingCodeArray = listOfDevices.split(/\s*,\s*/);

  // for each building code, determine if the associated devices are all on (working).
  for (var curCode = 0; curCode < buildingCodeArray.length; curCode++) {

    // get the list of objects referencing the current building code:
    var deviceList = csvData.get(buildingCodeArray[curCode]);

    // Error Check: return unknown icon if the device list for a building code is empty
    if (deviceList == null) {
      return unknownIcon;
    }
    // for each device (for a code), check if its online:
    for (var curDevice = 0; curDevice < deviceList.length; curDevice++) {
      if (deviceList[curDevice].Status == "down") {
        return badIcon;
      }
    }
  }
  // else, return the good icon (green checkmark)
  return goodIcon;
}

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

    });
}

/**
 * Updates the map periodically.
 * 
 * @param {Array} db the SQLite database.
 */
function update(db) {

  // Clear all markers
  markerGroup.clearLayers();
  // // reload CSV data
  loadCSV('data/exampleAkipsStatus.csv')
    //   // place new markers
    .then(() => placeMarkerSQL(db))
}

// START
run();