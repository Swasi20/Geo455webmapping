

var streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
});

var topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'SRTM30-Colored-Hillshade'
});


var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets]
});
// this is extracting the original map center and saving it in the variable
var homeCenter = map.getCenter();

//this is extracting the original zoom and saving it in the variable
var homeZoom = map.getZoom();

L.easyButton(('<img src="Home_icon_black.png", height=70%>'), function () {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

var greatwallPopup =
  "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/256px-20090529_Great_Wall_8185.jpg' alt='Great Wall' width='150px'/>";

var chichenPopup =
  "Chichen-Itza, Mexico<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg/256px-003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg' alt='Chichen Itza' width='150px'/>";

var petraPopup =
  "Petra, Jordan<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Monastery%2C_Petra%2C_Jordan8.jpg/256px-The_Monastery%2C_Petra%2C_Jordan8.jpg' alt='Petra' width='150px'/>";

var machuPopup =
  "Machu Picchu, Peru<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/256px-Machu_Picchu%2C_Peru.jpg' alt='Machu Picchu' width='150px'/>";

var christPopup =
  "Christ the Redeemer, Rio de Janeiro<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg/256px-Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg' alt='Christ the Redeemer' width='150px'/>";

var coloPopup =
  "Colosseum, Rome<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/256px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg' alt='Colosseum' width='150px'/>";

var tajPopup =
  "Taj Mahal, India<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/256px-Taj-Mahal.jpg' alt='Taj Mahal' width='150px'/>";

var customOptions = { maxWidth: "150", className: "custom" };



var landmarks = L.layerGroup().addTo(map);

var wonders = [
  {name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup },
  { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup },
  { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
  { name: "Chichen Itza", coords: [20.6843, -88.5678], popupHtml: chichenPopup },
  { name: "Machu Picchu", coords: [-13.1631, -72.5450], popupHtml: machuPopup },
  { name: "Taj Mahal", coords: [27.1751, 78.0421], popupHtml: tajPopup },
  { name: "Christ the Redeemer", coords: [-22.9519, -43.2105], popupHtml: christPopup }
];




function addWondersToLayer(dataArray, layerGroup) {

  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i];

    var marker = L.marker(feature.coords);

    marker.bindPopup(feature.popupHtml, customOptions);
	    // Add a tooltip that appears on hover (no click needed)
    marker.bindTooltip(feature.name, {
      direction: "top",
      sticky: true,
      opacity: 0.9
    });


    marker.addTo(layerGroup);
  }
}


addWondersToLayer(wonders, landmarks);






var lines = L.layerGroup();



var greatWallLineCoords = [
  [40.45058574410227, 116.54903113946699],
  [40.44940804004364, 116.55324919831969],
  [40.44714494004076, 116.55510028845048],
  [40.44545911200895, 116.55455406535388],
  [40.44428131665059, 116.55637480900924],
  [40.44060923386488, 116.56019837128976],
  [40.43557422832096, 116.56189773235194],
  [40.431023921892326, 116.56441642808237],
  [40.43005690361108, 116.56583967643232],
  [40.42912280914733, 116.56815090383526],
  [40.42817101495977, 116.56756399877838]
];

// Create the line and add to the "lines" layergroup
var greatWallLine = L.polyline(greatWallLineCoords, {
  weight: 14
}).addTo(lines);

// Add popup + tooltip like a marker
greatWallLine.bindPopup(greatwallPopup, customOptions);
greatWallLine.bindTooltip("Great Wall of China", { sticky: true });

// Optional: zoom to the line when clicked
greatWallLine.on("click", function () {
  map.fitBounds(greatWallLine.getBounds());
});

// Turn the line layer ON by default
lines.addTo(map);


var baseLayers = {
  Hillshade: topo,
  Streets: streets,
  Imagery: imagery
};

var overlays = {
  "Seven Wonders": landmarks,
  "Great Wall": lines
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);


