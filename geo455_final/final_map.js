
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
  center: [38.71282443933921, -101.86550516794473],
  zoom: 5,
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


// Get GeoJSON data from the NWS weather alerts API
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';
 
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



//national parks layer and styling
var nationalLayer = L.geoJSON(nationalfeatures, {
  style: function(feature) {
    return {
      color: '#1e8449',        // border color
      fillColor: '#1e8449',    // fill color
      weight: 2,
      fillOpacity: 0.5
    };
  },
  onEachFeature: onEachFeature
});


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

  // Build popup content using properties
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

//air data api
var airNowUrl = "https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=44.0&longitude=-91.0&distance=100&API_KEY=48E3AC0D-96AF-401D-9C4B-484DE81D0E36";
var airQualityLayer = L.layerGroup();

function loadAirQuality() {
  fetch(airNowUrl)
    .then(res => res.json())
    .then(data => {
      airQualityLayer.clearLayers(); // prevents duplicates

      data.forEach(obs => {
        if (obs.Latitude && obs.Longitude) {
          L.circleMarker([obs.Latitude, obs.Longitude], {
            radius: 8,
            fillColor: getAQIColor(obs.AQI),
            color: "#000",
            weight: 1,
            fillOpacity: 0.8
          })
          .bindPopup(`
            <strong>${obs.ReportingArea}</strong><br>
            AQI: ${obs.AQI}<br>
            Category: ${obs.Category.Name}
          `)
          .addTo(airQualityLayer);
        }
      });
    })
    .catch(err => console.error(err));
}

loadAirQuality();

/* Layer control and Menu Item */
var baseLayers = {
  'streets': daytime,
  'Imagery': imagery,
  'Night View': Nightview
};
var overlays = { 
"National Park": nationalLayer, 
"Weather alerts": weatherLayer
};

var layerControl = L.control.layers(baseLayers, overlays ,{ collapsed: false }).addTo(mymap);



airQualityLayer.addTo(mymap);




