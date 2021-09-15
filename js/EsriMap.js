/**
* Generates the map used for the project.
* The map is created using data from ESRI ArcGIS. It is then parsed through Leaflet.JS to visualize network nodes.
* The documentation for ESRI Leaflet can be found here: https://esri.github.io/esri-leaflet/api-reference/
*/

// Map object with default starting viewpoint and a minimum zoom level set.
const map = L.map('map', {
  minZoom: mapMinZoom,
  scrollWheelZoom: mapScrollWheelZoom, // disable original zoom function
  smoothWheelZoom: mapSmoothWheelZoom,  // enable smooth zoom 
  smoothSensitivity: mapSmoothSensitivity  // zoom speed. default is 1
}).setView([mapStartLatitude, mapStartLongitude], mapStartZoomLevel);

// Sets basemap to use for map generation.
L.esri.basemapLayer('Streets').addTo(map);

/**
* The following layers are from the official Northeastern University Public Campus Map (found on the facilities site):
* https://vopvccankxxqzoa1.maps.arcgis.com/home/item.html?id=a5316156cc614b0f9f9ae75ee54d2d6e
* 
* The layers necessary for visualization are: Building Use by Type, Northeastern University Buildings, Mis_Lab,
* Tile_Labels, Vector_BaseMap, and CPRE_OpenStreetMap2.
*/

/*
Feature Layers
*/

// "Building Use by Type" and "Northeastern University Buildings" - Building Outlines
L.esri.featureLayer({
  url: 'https://services5.arcgis.com/S8KZ4xiwVgqpYP63/arcgis/rest/services/Northeastern_University_Buildings_ID_Name_Use_Image_view/FeatureServer/0'
}).addTo(map);

/*
Vector Tile Layers
*/

// "CPRE_OpenStreetMap2" - Topographic Tiling for detailed waypoints and POIs using OpenStreetMap2 data.
// L.esri.Vector.vectorTileLayer(
// "https://basemaps.arcgis.com/arcgis/rest/services/OpenStreetMap_v2/VectorTileServer"
// ).addTo(map);

// "Vector_BaseMap" - Topographic Tiling for detailed roads and terrain around the Boston campus
L.esri.Vector.vectorTileLayer(
  "https://tiles.arcgis.com/tiles/S8KZ4xiwVgqpYP63/arcgis/rest/services/Vector_w_o_Labels/VectorTileServer"
).addTo(map);

// "Mis_Lab" - Part 1 of building labels
L.esri.Vector.vectorTileLayer(
  "https://tiles.arcgis.com/tiles/S8KZ4xiwVgqpYP63/arcgis/rest/services/Mis_Lab/VectorTileServer"
).addTo(map);

// "Tile_Labels" - Part 2 of building labels
L.esri.Vector.vectorTileLayer(
  "https://tiles.arcgis.com/tiles/S8KZ4xiwVgqpYP63/arcgis/rest/services/TileCahce_Vector_12032020/VectorTileServer"
).addTo(map);