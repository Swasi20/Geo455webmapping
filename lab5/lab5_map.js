
//BASEMAPS//
var streets = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
});

// WMS basemap (imagery)
var phyGeo =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 8
});
 
//MAP + HOME BUTTON//

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets]
});


//default home view
var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

//home button: return to default view//
L.easyButton(
  '<img src="images/globe_icon.png", height=70% />',
  function () {
  map.setView(homeCenter, homeZoom);
  }, 
  "Home"
).addTo(map);


//popups 
var greatwallPopup =
  "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/d/d8/Great_Wall_of_China_%282639612640%29.jpg' alt='Great Wall' width='150px'/>";

var chichenPopup =
  "Chichen-Itza, Mexico<br/><img src='https://upload.wikimedia.org/wikipedia/commons/a/a1/Chichen_itza.JPG' alt='Chichen Itza' width='150px'/>";

var petraPopup =
  "Petra, Jordan<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Petra_Jordan_BW_36.JPG/1280px-Petra_Jordan_BW_36.JPG' alt='Petra' width='150px'/>";

var machuPopup =
  "Machu Picchu, Peru<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/1280px-Machu_Picchu%2C_Peru.jpg' alt='Machu Picchu' width='150px'/>";

var christPopup =
  "Christ the Redeemer, Rio de Janeiro<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/960px-Christ_the_Redeemer_-_Cristo_Redentor.jpg' alt='Christ the Redeemer' width='150px'/>";

var coloPopup =
  "Colosseum, Rome<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/256px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg' alt='Colosseum' width='150px'/>";

var tajPopup =
  "Taj Mahal, India<br/><img src='https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg' alt='Taj Mahal' width='150px'/>";

var customOptions = { maxWidth: "150", className: "custom" };


//data array as a layer//
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

//function: add markers from the data array
var iconFiles = [
  "images/icon_1.png",
  "images/icon_2.png",
  "images/icon_3.png",
  "images/icon_4.png",
  "images/icon_5.png",
  "images/icon_6.png",
  "images/icon_7.png",
];

var wonderIcons = [];
for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    })
  );
}


function addWondersToLayer(dataArray, layerGroup, iconsArray) {
  var markers = [];

  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i];

    var marker = L.marker(feature.coords, { icon: iconsArray[i] })
      .bindPopup(feature.popupHtml, customOptions)
      .bindTooltip(feature.name, { direction: "top", sticky: true, opacity: 0.9 })
      .addTo(layerGroup);

    markers.push(marker);
  }

  return markers;
}

var wonderMarkers = addWondersToLayer(wonders, landmarks, wonderIcons);



//funtion: add buttons to sidebar that zoom to each site//

var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 6; // pick a zoom level you like

for (var i = 0; i < wonders.length; i++) {
  (function(index) {
    // Create a <button>
    var btn = document.createElement("button");
    btn.type = "button";

    // If using Bootstrap, use btn classes. If not, you can use your own CSS.
    btn.className = "btn btn-outline-secondary btn-sm text-start";

    // Use the SAME icon as the marker + show name
    btn.innerHTML =
      '<img src="' + iconFiles[index] + '" style="width:18px;height:18px;margin-right:8px;">' +
      wonders[index].name;

    // When clicked: zoom to the location + open popup
    btn.addEventListener("click", function() {
      map.setView(wonders[index].coords, wonderZoom);
      wonderMarkers[index].openPopup();
    });

    buttonsDiv.appendChild(btn);
  })(i);
}


//layer control menu
var baseLayers = {
  'Physical Geography': phyGeo,
  'Streets': streets,
  'Imagery': imagery
};

var overlays = {};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);


//click on MAP interactivity : popup + update panel//

var clickPopup = L.popup(); 

function onMapClick(e) {
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;
  
//popup at the clicked location//
   clickPopup
    .setLatLng(e.latlng)
    .setContent(
      "You clicked the map at:<br>" +
        "<b>Lat:</b> " + lat.toFixed(5) + "<br>" +
        "<b>Lon:</b> " + lon.toFixed(5)
  )
    .openOn(map); 

  //update the info panel//
    document.getElementById("click-lat").textContent = lat.toFixed(5);
    document.getElementById("click-lon").textContent = lon.toFixed(5);
}

//LEAFLET EVENT API//
  map.on("click", onMapClick);



//real-time ISS: moving marker + jump button

var issIcon = L.icon({
  iconUrl: "images/iss200.png",
  iconSize: [80, 52],
  iconAnchor: [25, 16],
});

var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// API endpoint
var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function getISS() {
  try {
    var response = await fetch(api_url);
    if (!response.ok) throw new Error("ISS API error");
    var data = await response.json();
    var latitude = data.latitude;
    var longitude = data.longitude;

    issMarker.setLatLng([latitude, longitude]);

    document.getElementById("lat").textContent = latitude.toFixed(3);
    document.getElementById("lon").textContent = longitude.toFixed(3);
    document.getElementById("iss-time").textContent = formatTime(new Date());
  } catch (err) {
    document.getElementById("iss-time").textContent = "ISS unavailable";
  }
}

// Initial call + refresh
getISS();
setInterval(getISS, 1000);

// Jump to ISS button (required feature)
document.getElementById("btn-iss").addEventListener("click", function () {
  var ll = issMarker.getLatLng();
  map.setView([ll.lat, ll.lng], 4);
});


//MiniMAP basemap// 
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);


