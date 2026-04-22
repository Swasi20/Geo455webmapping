
// basemap//
var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var Nightview = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});

var daytime = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});
//--create map
var mymap = L.map("map", {
  center: [46.317809238074574, -92.58985401807159],
  zoom: 9,
  layers: [daytime],
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

//data layers//
var nationalLayer = L.geoJSON(nationalfeatures);



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

function resetnationalfeaturesHighlight (e) { 
   densitylayer.resetStyle (e.target); 
   e.target.closePopup(); 
}

//ajax data 
var pollution = new L.GeoJSON.AJAX( "IcisAir.geojson.json");
/* Layer control and Menu Item */
var baseLayers = {
  'streets': daytime,
  'Imagery': imagery
};
var overlays = { 
"National Features": nationalLayer, 
"Pollution": pollution,
};

var layerControl = L.control.layers(baseLayers, overlays ,{ collapsed: false }).addTo(mymap);








