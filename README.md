# 🗺️ CampusNetworkMap
Map visualizing the status of various Northeastern University network devices using LeafletJS (Esri Leaflet), Papa Parse, and sql.js (SQLite).

### 📷 Screenshots
[![Northeastern-Campus-Network-Map.png](https://i.postimg.cc/BQ9mDtGQ/Northeastern-Campus-Network-Map.png)](https://postimg.cc/MX50J6Th)

### 📊 Visualization
Markers are placed at network nodes on a map with specific icons, a green checkmark if the network device is operational and a red X if not. The map is centralized on the Northeastern University Boston campus.

### 💾 Data Resources
Northeastern Building data was manually created into a SQLite database containing the coordinates of each building. The status of each network device is updated every 5 minutes by parsing a CSV file. Map data comes from the Esri ArcGIS servers.

### ✍️ Additional Credits  
Northeastern Mapping and Tiles (Esri ArcGIS):
- Negar Pourshadi
- Scott Margeson
- Begum Tanriverdi Bolukbas

Checkmarks
- Freepik

### 📝 TODO:
- Update the map periodically (every 5 minutes) (DONE)
  - Include a "Time last updated" indicator
- Search bar for markers
- Table of all/non-functional network devices
- Amount of operational / total count