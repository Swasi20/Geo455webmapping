var basemap = L.tileLayer('https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
});

var mymap = L.map('map', {
    center: [43.09157730670122, -89.41174811804763],
    zoom: 7,
    layers: basemap,
});  

var cities = L.geoJson(loc, {
     style: function (feature) {
        return { fillColor: 'rgba(206, 154, 177, 0.63)', fillOpacity: 0.25,
               color: '#014bb9c5', weight: 2, opacity: 1};
    },
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindTooltip(feature.properties.NAME, {permanent: false, direction: 'right'});
    }
}).addTo(mymap);
    
mymap.fitBounds(cities.getBounds());

var migrationLayer = new L.migrationLayer({
    map: mymap,
    data: data,
    pulseRadius:20,
    pulseBorderWidth:1,
    arcWidth:5,
    arcLabel:false,
    arcLabelFont:'14px sans-serif',
    maxWidth:10
});

migrationLayer.addTo(mymap);

function hide(){
    migrationLayer.hide();
}
function show(){
    migrationLayer.show();
}
function play(){
    migrationLayer.play();
}
function pause(){
    migrationLayer.pause();
}
function returnto(){
  window.location.href = "../index.html";
}

// --------------------------------------------------
// 2. SCALEBAR
// -------------------------------------------------- 
L.control.scale({position: 'bottomright', maxWidth: '150', metric: 'True'}).addTo(mymap); 
    
        
// --------------------------------------------------
// 3. ADD MINIMAP
// --------------------------------------------------
var miniMapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

var miniMap = new L.Control.MiniMap(miniMapLayer, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomleft'
}).addTo(mymap);
