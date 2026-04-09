var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var mymap = L.map('map', {
    center: [28.972443641658437, 84.59443216376953],
    zoom: 8,
    layers: streets
});

//Default home view + button//

var homeCenter = mymap.getCenter(); 
var homeZoom = mymap.getZoom();

L.easyButton(
    '<img src="images/globe_icon.png" height="60%"/>', 
    function () {
    mymap.setView(homeCenter, homeZoom);
}, 
    "Home"
).addTo(mymap);



// mntpeaks icon
var myIcon = new L.Icon({
     iconSize: [20, 20],
     iconAnchor: [10, 15],
     popupAnchor:  [1, -24],
     iconUrl: 'images/peaks.png'
 });

//info
var peaks = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer){
        featureLayer.bindPopup(
            '<p>Peak Name: <b>'+feature.properties.TITLE+ '</b></br>' +
            'Peak Height: '+feature.properties.Peak_Heigh+' m' + '</br>'+
            'Number of Deaths: '+feature.properties.number_of_+'</br>'+
            'Number of Expeditions: '+feature.properties.number_of1+'</p>'
        );
    }, 
    pointToLayer: function (feature, latlng) {
            return L.marker(latlng,{icon: myIcon});
    }
}).addTo(mymap);


//proportional circles//

//Proportional circles//
function getRadius(area) {
    var radius = Math.sqrt(area/Math.PI);
    return radius * 2;
}

var propcircles = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Peak Name: <b>' + feature.properties.TITLE + '</b></br>' +
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>');
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: "#920101", 
            color: '#920101',
            weight: 2,       
            radius: (feature.properties.number_of1*0.06),
            fillOpacity: 0.35
        }).on({
            mouseover: function(e) {
                this.openPopup();
                this.setStyle({fillOpacity: 0.8, fillColor: '#2D8F4E'});

            },
            mouseout: function(e) {
                this.closePopup();
                this.setStyle({fillOpacity: 0.35, fillColor: '#920101'});  
            }
    });
  }
});

//heatmap
var min = 0;
var max = 0;    
var heatMapPoints = [];

mtn_peaks.features.forEach(function(feature) {
    heatMapPoints.push([
        feature.geometry.coordinates[1], 
        feature.geometry.coordinates[0], 
        feature.properties.number_of_
    ]);
    
    if(feature.properties.number_of_<min||min===0) {
        min=feature.properties.number_of_;
    }
    
    if(feature.properties.number_of_>max||max===0){
        max=feature.properties.number_of_;
    }
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient:{0.5: 'blue', 0.75: 'lime', 1: 'red'},
}).addTo(mymap);


//clustermap
var clustermarkers = L.markerClusterGroup();
mtn_peaks.features.forEach(function(feature) {
    clustermarkers.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
});

mymap.addLayer(clustermarkers);

//search box 
var searchControl = new L.Control.Search({
    position:'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Peak Name: e.g. Everest, Lhotse',   
    moveToLocation: function(latlng, title, map) {
        mymap.setView(latlng, 15);}
});

mymap.addControl(searchControl); 

//map scale
L.control.scale({
    position: 'bottomright'
}).addTo(mymap); 


//clickable layers in legend


var baseLayers = {};

var overlays = {
    "<img src='images/peaks.png' height=16> Location of Himalayan Peaks": peaks,
    "<img src='images/propcircles.png' height=16> Expeditions Proportional Circles": propcircles,
    "<img src='images/dead.jpg' height=16> Death Density Heat Map": heat,
    "<img src='images/cluster_icon.png' height=16> Clustering of Peaks": clustermarkers
};

var legend = L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);
 
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



