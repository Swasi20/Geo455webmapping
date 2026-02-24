const map = L.map("map").setView([46.04170430098554, -103.00527283365042], 6);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon2 = L.icon({
    iconUrl: 'images/icon_2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon3 = L.icon({
    iconUrl: 'images/icon_3.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon4 = L.icon({
    iconUrl: 'images/icon_4.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon5 = L.icon({
    iconUrl: 'images/icon_5.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon6 = L.icon({
    iconUrl: 'images/icon_6.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon7 = L.icon({
    iconUrl: 'images/icon_7.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon8 = L.icon({
    iconUrl: 'images/icon_8.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon9 = L.icon({
    iconUrl: 'images/icon_9.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon10 = L.icon({
    iconUrl: 'images/icon_10.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon11 = L.icon({
    iconUrl: 'images/icon_11.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon12 = L.icon({
    iconUrl: 'images/icon_12.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});



var Far = L.marker([47.07964271405545, -96.78608541195688], 
    {icon: myIcon1})
    .bindPopup("<b>Fargo")
    .addTo(map);
  
var med = L.marker([47.06732047457057, -103.5571953465511], 
    {icon: myIcon2})
    .bindPopup("<b>Medora Musical")
    .addTo(map);

var mitch = L.marker([43.716028292692755, -98.0250523756112], 
    {icon: myIcon3})
    .bindPopup("<b>Mitchel Corn Palace")
    .addTo(map);
  
var big = L.marker([44.594119200846436, -107.37855819842974], 
    {icon: myIcon4})
    .bindPopup("<b>Bighorn Naional Forest")
    .addTo(map);

var shs = L.marker([44.108539808657405, -109.51483700796074], 
    {icon: myIcon5})
    .bindPopup("<b>Shoshone National Forest")
    .addTo(map);
  
var Rush = L.marker([43.94070599187389, -103.40914402989442], 
    {icon: myIcon6})
    .bindPopup("<b>Rushmore Tramway Adventures")
    .addTo(map);

var Mount = L.marker([43.904976031192646, -103.45508889503726], 
    {icon: myIcon7})
    .bindPopup("<b>Mount Rushmore National Mermorial")
    .addTo(map);
  
var cody = L.marker([44.52735328009595, -109.05369814969497], 
    {icon: myIcon8})
    .bindPopup("<b>Cody")
    .addTo(map);

var lake = L.marker([44.444560440183686, -110.33169546432006], 
    {icon: myIcon9})
    .bindPopup("<b>Yellowstone Lake")
    .addTo(map);
  
var can = L.marker([44.77187432515899, -110.4732802508172], 
    {icon: myIcon10})
    .bindPopup("<b>Grand canyon of yellowstone ")
    .addTo(map);
  