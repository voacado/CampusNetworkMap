/*
   _____ ____  _   _ ______ _____ _____ 
  / ____/ __ \| \ | |  ____|_   _/ ____|
 | |   | |  | |  \| | |__    | || |  __ 
 | |   | |  | | . ` |  __|   | || | |_ |
 | |___| |__| | |\  | |     _| || |__| |
  \_____\____/|_| \_|_|    |_____\_____|                                    
*/

// From Run.js - File paths for data
var databasePath = 'data/buildings.db';
var akipsDataPath = 'data/akipsStatus5843.csv';
// Time (in seconds) per refresh of data
var refreshTimerinSeconds = 30;

// From EsriMap.js - Map configuration
var mapMinZoom = 15.25 // Furthest out a user can zoom (reduces load)
var mapScrollWheelZoom = false // disable original zoom function
var mapSmoothWheelZoom = true // enable smooth zoom 
var mapSmoothSensitivity = true // zoom speed. default is 1
var mapStartLatitude = 42.339 // on page-load latitude
var mapStartLongitude = -71.089 // on page-load longitude
var mapStartZoomLevel = 17 // on page-load zoom level

// From MarkerStatus.js - File paths for icon images
var goodIconPath = 'images/check-mark.svg'
var badIconPath = 'images/x-mark.svg'
var unknownIconPath = 'images/unknown.svg'

// From LoadData.js - Marker Cluster configuration
var spiderfyOnMaxZoomCond = false // recommended to disable when using disableClusteringAtZoom
var disableClusteringAtZoomValue = 17 // prevents clustering until zoom level reached
var maxClusterRadiusValue = 9999 // distance one cluster will encompass

