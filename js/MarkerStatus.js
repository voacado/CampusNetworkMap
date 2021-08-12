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

/**
* Base Icon model - svg icons are sized as 24x24
*/
var StatusIcon = L.Icon.extend({
  options: {
    iconUrl: 'images/check-mark.svg',
    iconSize: [24, 24], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
  }
});

/**
* Good (working) and bad (not working) icons to be used as markers
*/
var goodIcon = new StatusIcon({ iconUrl: "images/check-mark.svg" }),
  badIcon = new StatusIcon({ iconUrl: "images/x-mark.svg" });

/**
* parseCSV() takes in the directory of the CSV file. It calls placeMarker() once
* it has finished parsing the CSV file.
* 
* Parse CSV (containing network data) using Papa Parser into an array.
* Papa.parse creates an object with 3 elements: data, errors, and meta.
* The data is an array of Objects that represents each row of the CSV.
*
* @param {*} location the file location of the CSV file.
*/
function parseCSV(location) {
  var data;

  Papa.parse(location, {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {

      // wait for the parser to finish before attempting to place any markers.
      placeMarker(results.data);
    }
  });
}

/**
* Places the network data as nodes onto the map.
* @param {*} data an array of data points.
*/
function placeMarker(data) {
  for (var i in data) {
    var row = data[i];
    var marker = L.marker([row.Latitude, row.Longitude],
      { icon: ("on" == row.Status ? goodIcon : badIcon) })
      .bindPopup(row.Title)
      .addTo(map);
  }
}

// Start parsing and plotting network points.
// TODO: have this command run every time the CSV is updated or every "x" minutes.
parseCSV('networkStatus.csv');