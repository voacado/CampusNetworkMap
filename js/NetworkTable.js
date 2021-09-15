/**
 * Toggle the visiblity of the network table element.
 * Activation: Button on page.
 */
function showNetworkTable() {
  // get the network table pop-up element
  var x = document.getElementById("networkTablePopup");
  // and toggle its visiblity
  x.classList.toggle("visible");
}

/**
 * Updates the network table displayed when clicking the yellow button.
 * Data is parsed from a CSV and method is run in Run.js.
 * 
 * @param {Map} tableData a list of the locations and their devices
 */
function updateNetworkTable(tableData) {

  let table = '<table border="1">';
  table += `<tr><th>Code</th><th>Description</th><th>Device</th><th>Status</th></tr>`;

  // The data structure for the map (tableData) is:
  // a list of buildings that holds an object that is a list of devices

  // for each building:
  tableData.forEach((tableBuilding, index) => {
    // for each device in a building:
    tableBuilding.forEach((tableDevice, index) => {

      // Append the data to the table.
      table += `<tr>`;
      table += `<td>${tableDevice.Code}</td>`;
      table += `<td>${tableDevice.Description}</td>`;
      table += `<td>${tableDevice.Device}</td>`;
      table += `<td>${tableDevice.Status}</td>`;
      table += `</tr>`;

    });
  });

  document.getElementById("networkTableContent").innerHTML = table;
}

/**
 * Toggles the visibility of a row in the network table visualization.
 * Specifically, the code only looks through column 3 ("Status") for "up" and shows/hides respectively.
 */
function toggleUpVisiblity() {

  // Toggle Button text between "Display Down Devices" and "Display All Devices"
  var button = document.getElementById("showHideWorkingButton");
  if (button.innerHTML == "Display All Devices") {
    button.innerHTML = "Display Down Devices";
  }
  else {
    button.innerHTML = "Display All Devices";
  }


  // For each row, if the Status is "up", hide it.
  var table = document.getElementById("networkTableContent");
  for (var i = 0, row; row = table.rows[i]; i++) {

    if (row.cells[3].textContent == 'up') {
      row.classList.toggle('tableRowHidden')
    }
  }
}

/**
 * Update the values of the error table visualization.
 * @param {Array} errorTableData a list of devices missing information for proper visualization.
 */
function updateNetworkErrorTable(errorTableData) {
  let table = '<table border="1">';
  table += `<tr><th>Code</th><th>Description</th><th>Device</th><th>Status</th></tr>`;

  // The data structure for the map (tableData) is:
  // a list of buildings that holds an object that is a list of devices

  // for each device in the table of invalid devices:
  errorTableData.forEach((tableDevice, index) => {

    // Append the data to the table.
    table += `<tr>`;
    table += `<td>${tableDevice.data.Code}</td>`;
    table += `<td>${tableDevice.data.Description}</td>`;
    table += `<td>${tableDevice.data.Device}</td>`;
    table += `<td>${tableDevice.data.Status}</td>`;
    table += `</tr>`;

  });

  if (errorTableData.length == 0) {
    document.getElementById("malformedTableHeader").classList.add("tableRowHidden");
    document.getElementById("networkErrorTableContent").classList.add("tableRowHidden");
  } else {
    document.getElementById("malformedTableHeader").classList.remove("tableRowHidden");
    document.getElementById("networkErrorTableContent").classList.remove("tableRowHidden");
  }

  document.getElementById("networkErrorTableContent").innerHTML = table;
}

/**
 * Create and update the network table for each marker.
 * @param {String} buildingCodes a string of building codes associated with a building.
 * @returns HTML code for a table.
 */
function createIndividualTable(buildingCodes) {

  // let table = '<table border="1">';
  let table = '<table class ="markerTableContent">';
  table += `<tr><th>Code</th><th>Description</th><th>Device</th><th>Status</th></tr>`;

  // In the event of multiple building codes, split them up (by comma delimiter)
  var buildingCodeArray = buildingCodes.split(/\s*,\s*/);

  // The data structure for the map (tableData) is:
  // a list of buildings that holds an object that is a list of devices

  // for each building code, determine if the associated devices are all on (working).
  for (var curIndex = 0; curIndex < buildingCodeArray.length; curIndex++) {

    curCode = buildingCodeArray[curIndex];

    // if the csvData map doesn't have data on the building code, return an empty string.
    if (!csvData.has(curCode)) {
      return "";
    } else {
      // for each device in a building:
      csvData.get(curCode).forEach((tableDevice, index) => {

        // Append the data to the table.
        table += `<tr>`;
        table += `<td>${tableDevice.Code}</td>`;
        table += `<td>${tableDevice.Description}</td>`;
        table += `<td>${tableDevice.Device}</td>`;
        table += `<td>${tableDevice.Status}</td>`;
        table += `</tr>`;
      })
    };
  }

  return table;

}