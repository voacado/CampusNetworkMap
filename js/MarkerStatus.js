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
* TODO: have this command run every time the CSV is updated or every "x" minutes.
*/

/**
* Base Icon model - svg icons are sized as 20x20
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
* Good (working) and bad (not working) icons to be used as markers
*/
var goodIcon = new StatusIcon({ iconUrl: "images/check-mark.svg" }),
  badIcon = new StatusIcon({ iconUrl: "images/x-mark.svg" });

/** 
 * Map of network devices and their statuses
 */
var csvData = new Map();

/**
* parseCSV() takes in the directory of the CSV file. It stores the data
* into a map called csvData.
* 
* Parse CSV (containing network data) using Papa Parser into an array.
* Papa.parse creates an object with 3 elements: data, errors, and meta.
* The data is an array of Objects that represents each row of the CSV.
*
* @param {*} location the file location of the CSV file.
*/
function parseCSV(location) {
  Papa.parse(location, {
    header: true,
    download: true,
    dynamicTyping: true,
    step: function (row) {
      // Create a Map of the CSV
      csvData.set(row.data.Device, row.data);
    }
  });

  // Promise determines if the function has finished running yet.
  return new Promise(function (resolve, reject) {
    resolve('Parse CSV done.')
  })
}

/**
 * Load a SQLite file from path.
 * @param {*} path the location of the SQLite file.
 */
function loadSQLite(path) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'arraybuffer';

  // once the file has been loaded, parse it:
  xhr.onload = e => {
    const uInt8Array = new Uint8Array(xhr.response);
    const db = new SQL.Database(uInt8Array);

    // Call helper method to place markers.
    placeMarkerSQL(db);
  };
  xhr.send();

  // Promise determines if the function has finished running yet.
  return new Promise(function (resolve, reject) {
    resolve('Load SQLite done.')
  })
}

/**
 * Places the network data as nodes onto the map.
 * @param {*} db the database containing network data.
 */
function placeMarkerSQL(db) {
  // .exec stores the result in an array of objects (numbered 0 to ...)
  const contents = db.exec("SELECT * FROM BuildingInfo");
  // this object contains two arrays: columns and values
  var data = contents[0].values;

  // Array Key:
  // 0 - Title, 1 - Latitude, 2 - Longitude, 3 - Devices
  for (var i in data) {
    var row = data[i];
    var marker = L.marker([row[1], row[2]],
      { icon: determineIcon(row[3]) }) // icon is good if all network devices are on for "x" building
      .bindPopup(row[0])
      .addTo(map);
  }
}

/**
 * Determines the icon to display for a building based on the state of the network devices 
 * in said building.
 * 
 * @param {*} listOfDevices a string of all the devices assigned to a building.
 * @returns the icon to use for the node on the map.
 */
function determineIcon(listOfDevices) {
  // Split the list of devices (comma-delimited, auto-trims extra spaces)
  // Example: accs-tf-133-1,accs-tf-173a-1,accs-tf-265b-1,accs-tf-r312-1,accs-tf-r410-1,accs-tf-x411-1

  var deviceArray = listOfDevices.split(/\s*,\s*/);

  // for each device in the device array (associated with a building), make sure all devices are on.
  for (var i = 0; i < deviceArray.length; i++) {
    // if any devices are off, return the bad icon (red x)
    if (csvData.get(deviceArray[i]).Status == "down") {
      return badIcon;
    }
  }
  // else, return the good icon (green checkmark)
  return goodIcon;
}

// Start parsing and plotting network points.

/**
 * Runs the code in sequential order. The CSV MUST be parsed first, then the SQLite db is loaded
 * and parsed appropriately.
 */
function run() {
  parseCSV('data/exampleAkipsStatus2.csv')
    .then(loadSQLite('data/buildings.db'));
}
run();