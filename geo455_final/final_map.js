
// basemap//
var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var Nightview = L.tileLayer(
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/2012-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
  {
    attribution: 'NASA GIBS',
    maxZoom: 8
  }
);
var daytime = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

//--create map
var mymap = L.map("map", {
  center: [45.871430282388985, -94.5583147208772],
  zoom: 7,
  layers: [Nightview],
});
//MiniMAP basemap// 
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap'
});

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(mymap);


//DATA LAYERS//

//boundary layer// 

var boundary = boundary; 

var boundaryLayer = L.geoJSON(boundary, {
  style: {
    color: "#082651",
    weight: 2,
    fillOpacity: 0
  }
}).addTo(mymap);

//aurora layer - unecessary
var aurora = 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json';
var auroraLayer = L.layerGroup();

function loadAurora() {
  fetch("https://services.swpc.noaa.gov/json/ovation_aurora_latest.json")
    .then(res => res.json())
    .then(data => {
      auroraLayer.clearLayers();

      data.coordinates.forEach(coord => {
        const lat = coord[0];
        const lon = coord[1];
        const intensity = coord[2]; // aurora strength

        if (intensity > 10) { // filter weak signals
          L.circleMarker([lat, lon], {
            radius: 4,
            fillColor: getAuroraColor(intensity),
            color: "#000",
            weight: 0.5,
            fillOpacity: 0.7
          })
          .bindPopup(`Aurora intensity: ${intensity}`)
          .addTo(auroraLayer);
        }
      });
    });
    
}

loadAurora();

function getAuroraColor(intensity) {
  return intensity > 80 ? "#ff0000" :
         intensity > 50 ? "#ff8800" :
         intensity > 30 ? "#ffff00" :
         intensity > 10 ? "#00ff00" :
                          "#00ffff";
}

auroraLayer.addTo(mymap);


//cloud cover data from openmeteo
var cloudlayer =
'https://api.open-meteo.com/v1/forecast?latitude=46.7296&longitude=-94.6859&hourly=cloud_cover,visibility';

fetch(cloudlayer)
  .then(response => response.json())
  .then(data => {

    // first hourly values
    var cloud = data.hourly.cloud_cover[0];
    var visibility = data.hourly.visibility[0];
    document.getElementById("cloud-panel").innerHTML = `
      <strong>Cloud Cover:</strong> ${cloud}%<br>
      <strong>Visibility:</strong> ${visibility} m`;
  });

//national parks layer and styling
var nationalLayer = L.geoJSON(nationalfeatures, {
  style: function(feature) {
    return {
      color: '#1e8449',        
      fillColor: '#1e8449',   
      weight: 2,
      fillOpacity: 0.5
    };
  },
  onEachFeature: onEachFeature
});

//observatories data
var observatoryIcon = L.icon({
  iconUrl: 'telescope.png',   
  iconSize: [32, 32],         
  iconAnchor: [16, 32],       
  popupAnchor: [0, -32]       
});

var observatoriesLayer = L.geoJSON(observatories, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: observatoryIcon });
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      feature.properties.observatory + ", <br>" +
      feature.properties.location
    );
  }
}).addTo(mymap);

//CONTROLS
//default home view
var homeCenter = mymap.getCenter();
var homeZoom = mymap.getZoom();

//home button: return to default view//
L.easyButton(
  '<img src="globe_icon.png", height=70% />',
  function () {
  mymap.setView(homeCenter, homeZoom);
  }, 
  "Home"
).addTo(mymap);



//alerts layer
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?area=MN';
 
var weatherLayer = L.geoJSON();

fetch(weatherAlertsUrl)
  .then(response => response.json())
  .then(data => {
    console.log("Features:", data.features.length);

    const validFeatures = data.features.filter(f => f.geometry);

    weatherLayer.addData({
      type: "FeatureCollection",
      features: validFeatures
    });

    weatherLayer.setStyle(function(feature) {
      let alertColor = 'orange';
      if (feature.properties.severity === 'Severe') {
        alertColor = 'red';
      }
      return { color: alertColor };
    });

    weatherLayer.eachLayer(function(layer) {
      layer.bindPopup(layer.feature.properties.headline);
    });

    weatherLayer.addTo(mymap); 
  })
  .catch(error => console.error('Error:', error));


//SEARCH FUNCTION//
var searchControl = new L.Control.Search({
    position:'topright',
    layer: nationalLayer,
    propertyName: 'UNIT_NAME',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Park Name: e.g. Voyagers National Park',   
    moveToLocation: function(latlng, title, map) {
        mymap.setView(latlng, 15);}
});

mymap.addControl(searchControl); 

//scale
L.control.scale({
    position: 'bottomright'
}).addTo(mymap); 

//moon phase from local 
function getMoonPhase(date = new Date()) {
  const lunarCycle = 29.53058867;
  const knownNewMoon = new Date(2000, 0, 6);

  const daysSince = (date - knownNewMoon) / 86400000;
  const phase = (daysSince % lunarCycle) / lunarCycle;

  let name = "";

  if (phase < 0.03 || phase > 0.97) name = "New Moon";
  else if (phase < 0.25) name = "Waxing Crescent";
  else if (phase < 0.27) name = "First Quarter";
  else if (phase < 0.50) name = "Waxing Gibbous";
  else if (phase < 0.53) name = "Full Moon";
  else if (phase < 0.75) name = "Waning Gibbous";
  else if (phase < 0.77) name = "Last Quarter";
  else name = "Waning Crescent";

  return name;
}

// Control for moon data
var moonControl = L.control({ position: 'topright' });

moonControl.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info moon-info');

  this._div.innerHTML = `
    🌙 Moon Phase:<br>
    <strong>${getMoonPhase()}</strong>
  `;

  return this._div;
};

moonControl.addTo(mymap);

//planets api usinf fetch
var planetsUrl =
"https://api.visibleplanets.dev/v3?latitude=46.7296&longitude=-94.6859";



fetch(planetsUrl)
  .then(res => res.json())
  .then(data => {

    console.log("PLANETS DATA:", data);

    let planets = data.data;

    let html = "<h4>Visible Planets</h4>";

    planets.forEach(p => {

      if (p.aboveHorizon) {
        html += `🪐<strong>${p.name}</strong><br>
          Alt: ${p.altitude.toFixed(1)}°<br>
          Az: ${p.azimuth.toFixed(1)}°<br><br>`;
      }
    });

    document.getElementById("planets-panel").innerHTML = html;

  })
  .catch(err => {
    console.error(err);
   document.getElementById("planets-panel").innerHTML = "Failed to load planets";
  });
//Pop up

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 4,
    color: '#92db72ff',
    fillOpacity: 0.7
  });

  layer.bringToFront();
}

function resetnationalfeaturesHighlight(e) {
  nationalLayer.resetStyle(e.target);
}

function onEachFeature(feature, layer) {

  var popupContent = `
    <strong>${feature.properties.UNIT_NAME}</strong><br>
    Type: ${feature.properties.UNIT_TYPE || "N/A"}<br>
    State: ${feature.properties.STATE || "N/A"}
  `;

  layer.bindPopup(popupContent);

  layer.on({
    mouseover: highlightFeature,
    mouseout: resetnationalfeaturesHighlight
  });
}



/* Layer control and Menu Item */
var baseLayers = {
  'streets': daytime,
  'Imagery': imagery,
  'Night View': Nightview
};
var overlays = { 
  "National Park": nationalLayer, 
  "Observatories": observatoriesLayer,
  "Weather alerts": weatherLayer 

};

var layerControl = L.control.layers(baseLayers, overlays ,{ collapsed: false }).addTo(mymap);





