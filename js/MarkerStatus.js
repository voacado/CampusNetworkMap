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

var goodDevices = 0;
var badDevices = 0;
var unkDevices = 0;

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
    unkDevices++;
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
      unkDevices++;
      return unknownIcon;
    }
    // for each device (for a code), check if its online:
    for (var curDevice = 0; curDevice < deviceList.length; curDevice++) {
      // offline device
      if (deviceList[curDevice].Status == "down") {
        badDevices++;
        return badIcon;
        // missing data about status
      } else if (deviceList[curDevice].Status == null) {
        unkDevices++;
        return unknownIcon;
      }
    }
  }
  // else, return the good icon (green checkmark)
  goodDevices++;
  return goodIcon;
}