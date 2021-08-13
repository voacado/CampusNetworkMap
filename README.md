# CampusNetworkMap
Map visualizing the status of various Northeastern University network devices using LeafletJS (Esri Leaflet), Papa Parse, and sql.js (SQLite).

### Visualization
Markers are placed at network nodes with specific icons, a green checkmark if the network device is operational and a red X if not.

### Data Resources
Northeastern Building data was manually created into a SQLite database containing the coordinates of each building. The status of each network device is updated every 5 minutes by parsing a CSV file. Map data comes from the Esri ArcGIS servers.

### Credits
Northeastern Mapping and Tiles:
- Negar Pourshadi
- Scott Margeson
- Begum Tanriverdi Bolukbas

Checkmarks
- Freepik

### TODO:
- Update the map periodically (every 5 minutes)
  - Include a "Time last updated" indicator
- Search bar for markers
- Table of all/non-functional network devices
- Amount of operational / total count