let map, infowindow, service;
let directionsRenderer;
let directionsService;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 44.9727, lng: -93.23540000000003 },
    zoom: 15,
  });
  infowindow = new google.maps.InfoWindow();
  // Create a renderer for directions and bind it to the map.

  var rendererOptions = {
    map: map
  }
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
}