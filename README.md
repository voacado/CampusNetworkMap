# 🗺️ CampusNetworkMap
Map visualizing the status of various Northeastern University network devices using LeafletJS (Esri Leaflet), Papa Parse, and sql.js (SQLite).

### 📷 Screenshots
[![Northeastern-Campus-Network-Map.png](https://i.postimg.cc/N0yYFx0T/Screenshot-2021-09-15-015408.png)](https://postimg.cc/WDPxfggb)

### 📊 Visualization
Markers are placed at network nodes on a map with specific icons, a green checkmark if the network device is operational and a red X if not. Additionally, a yellow marker with a white line indiciates that the building is missing information to properly visualize. The map is centralized on the Northeastern University Boston campus.

At the top-left is a yellow button labeled: (working devices) / (total devices) (malformed data). Pressing the button displays a table summarizing all data. At the bottom of this pop-up is a list of malformed devices, or devices where the data provided is insufficient.

At the bottom-left is an update timer, a manual refresh button, and a note about when the latest dataset was created.

### 💾 Data Resources
Northeastern Building data was manually created into a SQLite database containing the coordinates of each building. The status of each network device is updated every 5 minutes by parsing a CSV file (created by the AKiPS network management software). Map data comes from the Esri ArcGIS servers.

### ✍️ Additional Credits  
Northeastern Mapping and Tiles (Esri ArcGIS):
- Negar Pourshadi
- Scott Margeson
- Begum Tanriverdi Bolukbas

Checkmarks
- Freepik

### 📝 TODO:
- Update the map periodically (every 5 minutes) (DONE)
  - Include a "Time last updated" indicator (DONE)
- Table of all/non-functional network devices (DONE)
- Amount of operational / total count (DONE)
- Add table to marker descriptions on-map (DONE)
- Search bar for markers
- Add building code to name of every building
- GOAL: rewrite code using ReactJS for components and NodeJS for package management
- Condense / clean code
  - ex: css (markerTable and networkTable mostly similar CSS)
