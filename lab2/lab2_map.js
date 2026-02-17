const map = L.map("map").setView([44.97634758117221, -93.25679598189654], 5 );

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([-38.03547907871211, 175.8353500306822])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>This is the Putaruru Blue Spring, New Zealand.")
  .openPopup();
L.marker([62.02565523653806, -7.23986149069512])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Bøsdalafossur Waterfall, Faroe islands.")
  .openPopup();
L.marker([-74.14707388931703, 59.765619389338035])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br> This is the continent Antarctica.")
  .openPopup();




