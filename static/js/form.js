let map, infowindow, service;

function initMap() {
const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  map = new google.maps.Map(document.getElementById("form_map"), {
    zoom: 15,
    center: { lat: 44.9727, lng: -93.23540000000003 }
  });
  directionsRenderer.setMap(map);

  new ClickEventHandler(map, origin);
  
}
function isIconMouseEvent(e) {
    return "placeId" in e;
  }
class ClickEventHandler {
origin;
map;
directionsService;
directionsRenderer;
placesService;
infowindow;
infowindowContent;
    constructor(map, origin) {
        this.origin = origin;
        this.map = map;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);
        this.placesService = new google.maps.places.PlacesService(map);
        this.infowindow = new google.maps.InfoWindow();
        this.infowindowContent = document.getElementById("infowindow-content");
        this.infowindow.setContent(this.infowindowContent);
        // Listen for clicks on the map.
        this.map.addListener("click", this.handleClick.bind(this));
    }
    handleClick(event) {
        console.log("You clicked on: " + event.latLng);
        // If the event has a placeId, use it.
        if (isIconMouseEvent(event)) {
          console.log("You clicked on place:" + event.placeId);
          // Calling e.stop() on the event prevents the default info window from
          // showing.
          // If you call stop here when there is no placeId you will prevent some
          // other map click event handlers from receiving the event.
          event.stop();
          if (event.placeId) {
            this.calculateAndDisplayRoute(event.placeId);
            this.getPlaceInformation(event.placeId);
          }
        }
      }
      calculateAndDisplayRoute(placeId) {
        const me = this;
    
        this.directionsService
          .route({
            origin: this.origin,
            destination: { placeId: placeId },
            travelMode: google.maps.TravelMode.WALKING,
          })
          .then((response) => {
            me.directionsRenderer.setDirections(response);
          })
          .catch((e) => " do nothing")};
      getPlaceInformation(placeId) {
        const me = this;
    
        this.placesService.getDetails({ placeId: placeId }, (place, status) => {
          if (
            status === "OK" &&
            place &&
            place.geometry &&
            place.geometry.location
          ) {
            document.getElementById("addressTextField").value = place.formatted_address;
          }
        });
      }
    }
console.log("sup");
window.initMap = initMap;
