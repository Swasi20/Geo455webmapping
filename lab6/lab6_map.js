//--create map
var mymap = L.map("map", {
  center: [51.48882027639122, -0.1028811094342392],
  zoom: 11,
});

// basemap//
 L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
   attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
   maxZoom: 11,
   minZoom: 5
 }).addTo(mymap);
	
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
}).addTo(mymap);


 var  Density;
 var  Language; 
//chloropleth map colors
function getColorDensity(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}

function getColorLanguage(value) {
    return value > 6.45 ? '#094446':
           value > 4.43 ? '#206163':
           value > 2.25 ? '#539c9e':
           value > 0.98 ? '#90c3c5':
                         '#dae7e8';
}


function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
} 

function styleLanguage(feature){
    return {
        fillColor: getColorLanguage(feature.properties.density),   
        weight: 2,
        opacity: 1,
        color: '#000000',
        fillOpacity: 0.9
    };
} 

//highlight function//
function highlightFeature(e) {
  var layer = e.target;
  
  layer.setStyle({
    weight: 5,
    color: '#666',
    fillOpacity: 0.7
  });
  
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

// RESET FUNCTIONS 

function resetDensityHighlight (e) { 
    densitylayer.resetStyle (e.target); 
    e.target.closePopup(); 
}

//language density reset highlight
function resetLanguageHighlight(e) {
  languagelayer.resetStyle(e.target);
  e.target.closePopup();
}
 

//INTERACTION FUNCTIONS
function onEachDensityFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' + 
    '<span style="color:purple">' + feature.properties.pop_den + ' people/hectares</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetDensityHighlight
  });
}

function onEachLanguageFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.name + '</strong><br>' + 
    '<span style="color:blue">' + feature.properties.density + ' No English speakers/hectare</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetLanguageHighlight
  });
}

var densitylayer = L.geoJSON(data, { style: styleDensity, onEachFeature: onEachDensityFeature }).addTo(mymap);

// Add map data and choropleth colors
var languagelayer = L.geoJSON(densityPop, {style: styleLanguage, onEachFeature: onEachLanguageFeature});

function buildLegendHTML(title, grades, colorFunction) {
  var html = '<div class="legend-title">' + title + '</div>';
  
  for (var i = 0; i < grades.length; i++) {
    var from = grades[i];
    var to = grades[i + 1];
    
    html +=
      '<div class="legend-box">' + 
        '<span class="legend-color" style="background:' + colorFunction(from + 0.5) + '""></span>' + 
        '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' + 
        '</div>';
  }
  
  return html;
}
//Insert density legend into side panel
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
  densityLegendDiv.innerHTML = buildLegendHTML(
    'Population Density',
    [0, 32, 53, 87, 139],
    getColorDensity
  );
}

//Insert language legend into side panel
var languageLegendDiv = document.getElementById('language-legend');
if (languageLegendDiv) {
  languageLegendDiv.innerHTML = buildLegendHTML(
    'No English Speaker Density',
    [0, 0.99, 2.25, 4.43, 6.45],
    getColorLanguage
  );
}


/* Layer control and Menu Item */

var baseLayers = {
  "Population Density": densitylayer,
  "No English Speaker Density": languagelayer
};

var overlays = {};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);

