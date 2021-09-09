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

  var table = document.getElementById("networkTableContent");
  for (var i = 0, row; row = table.rows[i]; i++) {

    if (row.cells[3].textContent == 'up') {
      row.classList.toggle('tableRowHidden')
    }
  }
}

// function updateNetworkErrorTable(tableData) {

// }