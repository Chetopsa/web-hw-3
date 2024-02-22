
//_________________Table Image Stuff_____________________________________
let table = document.getElementById('table2');
let big_image = document.getElementById('image_block');
let clock_element =  document.getElementById('clock_widget');

const images = new Map([
["anderson",'"/img/anderson.jpg" alt= "Anderson"'], ["nicholson", '"/img/Nicholson.jpg" alt="Nicholson"'],
["wiley",'"/img/Wiley.jpg" alt= "Wiley"'], ["akerman", '"/img/Akerman.jpg" alt= "Akerman"'], ["civil", '"/img/Civil_Engineering.jpg" alt= "Civil_Engineering"'],
["bio", '"/img/Molecular_Biology.jpg" alt= "Molecular_Biology"'], ["walter", '"/img/walter.jpg" alt= "Walter"']
]);
//returns the key for the map given the images row
function getImage(row){
    if(row == 1 || row == 5){
        return "anderson";
    }
    else if(row == 2 || row == 6){
        return "nicholson";
    }
    else if(row == 3 || row == 9){
        return "wiley";
    }
    else if(row == 4 || row == 10){
        return "akerman";
    }
    else if(row == 7){
        return "civil";
    }
    else if(row == 8){
        return "bio";
    }
    else{
        return "walter";
    }
}
function addImageToCell(event){
    let row = event.target.closest('tr');

    if(row && row.rowIndex > 0){
        let img_cell = row.cells[3];
        let img_string = images.get(getImage(row.rowIndex));
        if (!img_cell.getAttribute('data-original-content')) {
            img_cell.setAttribute('data-original-content', img_cell.innerHTML);
        }
        console.log(img_string);
        
        row.style.background = "grey";
        img_cell.innerHTML += '<br><img id="thumbnail" src='+ img_string+'>';
        big_image.innerHTML = '<img id="bigger_image" src='+ img_string+'>';

    }
}
function removeImageFromCell(event){
    let row = event.target.closest('tr');
    if(row && row.rowIndex > 0){
        let img_cell = row.cells[3];
        if (img_cell.getAttribute('data-original-content')) {
            img_cell.innerHTML = img_cell.getAttribute('data-original-content');
            img_cell.removeAttribute('data-original-content');
        }
        if (row.rowIndex % 2 == 0){
            row.style.background = "white";
        }
        else{
            row.style.background = "#f2f2f2";
        }
        // big_image.innerHTML = '<img id="bigger_image" src="/img/gophers-mascot.png" alt="pic of building"></img>';
    }
}
function updateClock(element){
    let clock = new Date();
    element.innerHTML += "<table><tr><td>"+clock.getHours()+"</td><td>"+clock.getMinutes()+"</td><td>"+clock.getSeconds+"</td></tr></table>";
}

//___________google maps stuff______________


//grab locations
let locations = document.getElementsByClassName("locations");
let names = document.getElementsByClassName("names");
let times = document.getElementsByClassName("times");
//check elements
for (var i = 0; i < locations.length; i++) {
    var element = locations[i];
    console.log(element.textContent);
}

//initialize map

let map, infowindow, service;
let directionsRenderer;
let directionsService;
let stepDisplay;
let markerArray = [];
let panel;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 44.9727, lng: -93.23540000000003 },
    zoom: 15,
  });
  infowindow = new google.maps.InfoWindow();
  // Create a renderer for directions and bind it to the map.

  var rendererOptions = {
    map: map,
    panel: document.getElementById("sidebar")
  }
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
    // Try HTML5 geolocation. Gets the users location takes a while so annoying
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude,
    //       };

    //       infowindow.setPosition(pos);
    //       infowindow.setContent("Location found.");
    //       infowindow.open(map);
    //       map.setCenter(pos);
    //     },
    //     () => {
    //       handleLocationError(true, infoWindow, map.getCenter());
    //     },
    //   );
    // } else {
    //   // Browser doesn't support Geolocation
    //   handleLocationError(false, infoWindow, map.getCenter());
    // }
    load_places();
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }
function load_places(){
    service = new google.maps.places.PlacesService(map);
    for(let i = 0; i < locations.length; i++){
        var request = {
            query: locations[i].textContent,
            fields: ['name', 'geometry'],
        };
        service.findPlaceFromQuery(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                createMarker(results[0], names[i].textContent, times[i].textContent);
                map.setCenter(results[0].geometry.location);
            }
        });
    }
}
//create a marker
function createMarker(place, name, time) {
    if (!place.geometry || !place.geometry.location) return;
  
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });
  
    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(name + " | " + time +" | "+place.name);
      infowindow.open(map, marker);
    });
    // google.maps.event.addListener(marker, "mouseout", () => {
    //     infowindow.close();
    // });
  }
let transportMode;
function getDirections(){
    // Get the transportation mode
    let radios = document.getElementsByName('transport');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            transportMode = radios[i].value;
            break;
        }
    }
    console.log("TRANSPORT= "+transportMode);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;
              calculateDirections(lat, lng);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          },
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
}

function calculateDirections(lat, lng){
    console.log(lat+ " "+ lng);
    for (i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    let start = new google.maps.LatLng(lat, lng);
    let input = document.getElementById("placesInput").value;
    var req = {
        query: input,
        fields: ['name', 'geometry'],
    };
    console.log(transportMode);
    console.log(start);
    
    service.findPlaceFromQuery(req, function(results, status){
        var request = {
            origin: start,
            destination: results[0].geometry.location,
            travelMode: transportMode
        };
    // var request = {
    //     origin: "400-452 1st Ave NE, Minneapolis, MN 55414",
    //     destination: "222-234 Pleasant St SE, Minneapolis, MN 55455",
    //     travelMode: google.maps.TravelMode.DRIVING,
    //   };
    directionsService.route(request, function(response, status) {
        var warnings = document.getElementById("warnings_panel");
        if (status == 'OK') {
            warnings.innerHTML = "";
            directionsRenderer.setDirections(response);
            //showSteps(response);
        }
        else{
            console.log("JWFEWEEJ");
            warnings.innerHTML = "Couldn't Find Location";
            warnings.style.color ="red";
        }
      });
    });
}
function showSteps(directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    var myRoute = directionResult.routes[0].legs[0];
  
    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = new google.maps.Marker({
          position: myRoute.steps[i].start_point,
          map: map
        });
        attachInstructionText(marker, myRoute.steps[i].instructions);
        markerArray[i] = marker;
    }
  }
  
  function attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }

//_______________Event Listeners_________________
table.addEventListener('mouseover', addImageToCell);
table.addEventListener('mouseout', removeImageFromCell);
console.log("hello\n");
// initMap();
