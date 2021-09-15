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
var errorData = new Array();

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
      skipEmptyLines: true,
      step: function (row) {
        // Create a Map of the CSV as:
        // key = Building Code (ex. RY)
        // value = list of objects representing each network device for said code

        // if the data is incomplete (any fields are null), add the data to a different array
        // NOTE: because errored devices are not included in csvData, a building may be listed as good even if it has
        // an offline device if that offline device is errored (invalid info)
        if ((row.data.Code == null) || (row.data.Description == null) || (row.data.Device == null) || (row.data.Status == null)) {

          errorData.push(row);
          // Parse the timestamp
        } else if (row.data.Code == 'TIME') {
          document.getElementById("updateTimestamp").innerHTML = "(Newest Data: " + row.data.Device + ")";
        }
        // else if the Building Code key already exists, add it to the list,
        // otherwise create a new list.
        else if (csvData.has(row.data.Code)) {
          // for clarity sake, all keys are converted into strings (including integers)
          csvData.get(String(row.data.Code)).push(row.data);
        } else {
          csvData.set(String(row.data.Code), new Array(row.data));
        }
      },
      complete: function (results) {
        unkDevices = errorData.length;
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