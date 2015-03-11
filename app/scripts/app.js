'use strict';

var map;
var x = document.getElementById("demo");

// Set the center as Central Copenhagen
var locations = {
  "Copenhagen": [55.6834544,12.5858016]
};
var center = locations["Copenhagen"];
var radiusInKm = 1;

// Create a new GeoFire instance, pulling data from the public transit data

var rootRef = new Firebase('https://marketsquare.firebaseio.com/');
var adsRef = rootRef.child("ads");
var geoFire = new GeoFire(rootRef.child("_geofire"));

var adsInQuery = {};

var geoQuery = geoFire.query({
  center: center,
  radius: radiusInKm
});

geoQuery.on("key_entered", function(adId, adLocation) {
    // Specify that the vehicle has entered this query
    console.log("you have entered the gateway to hell..");
    adId = adId.split(":")[1];
    adsInQuery[adId] = true;

  // Look up the vehicle's data in the Transit Open Data Set
    adsRef.child().once("value", function(dataSnapshot) {
    // Get the vehicle data from the Open Data Set
	ad = dataSnapshot.val();

    // If the vehicle has not already exited this query in the time it took to look up its data in the Open Data
    // Set, add it to the map
    if (ad !== null && adsInQuery[adId] === true) {
      // Add the vehicle to the list of vehicles in the query
      adsInQuery[adId] = ad;

      // Create a new marker for the vehicle
      vehicle.marker = createVehicleMarker(vehicle, getVehicleColor(vehicle));
    }
  });
});

/*****************/
/*  GOOGLE MAPS  */
/*****************/
/* Initializes Google Maps */
function initializeMap() {
    console.log("in function initializeMap");
    // Get the location as a Google Maps latitude-longitude object
    var loc = new google.maps.LatLng(center[0], center[1]);

    // Create the Google Map
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: loc,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var circle = new google.maps.Circle({
	strokeColor: "#6D3099",
	strokeOpacity: 0.7,
	strokeWeight: 1,
	fillColor: "#B650FF",
	fillOpacity: 0.35,
	map: map,
	center: loc,
	radius: ((radiusInKm) * 1000),
	draggable: true
    });

    var updateCriteria = _.debounce(function() {
	var latLng = circle.getCenter();
	geoQuery.updateCriteria({
	    center: [latLng.lat(), latLng.lng()],
	    radius: radiusInKm
	});
    }, 10);
    google.maps.event.addListener(circle, "drag", updateCriteria);
};

function drawMarker(latitude, longitude){
    var marker = new google.maps.Marker({
	position : new google.maps.LatLng(latitude, longitude),
	map : map
    });
}

adsRef.on('child_added', function(snapshot) {
    drawMarker(snapshot.val().latitude, snapshot.val().longitude);
});
adsRef.on('child_removed', function(snapshot) {
    
});

/*      // Create a draggable circle centered on the map
  var circle = new google.maps.Circle({
    strokeColor: "#6D3099",
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: "#B650FF",
    fillOpacity: 0.35,
    map: map,
    center: loc,
    radius: ((radiusInKm) * 1000),
    draggable: true
  });
   var updateCriteria = _.debounce(function() {
    var latLng = circle.getCenter();
    geoQuery.updateCriteria({
      center: [latLng.lat(), latLng.lng()],
      radius: radiusInKm
    });
  }, 10);
  google.maps.event.addListener(circle, "drag", updateCriteria);

}

*/
function getLocation() {
    if (navigator.geolocation) {
	console.log("sending location from app.js");
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
  document.getElementById("latitude").value = position.coords.latitude;
  document.getElementById("longitude").value = position.coords.longitude;
    console.log("here is your lattitude from app.js " + document.getElementById("latitude").value);
    //x.innerHTML = "Latitude: " + position.coords.latitude +
    //"<br>Longitude: " + position.coords.longitude;
}

/* Adds a marker for the inputted vehicle to the map */
/*function createElementMarker(element, elementColor) {
  var marker = new google.maps.Marker({
    icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=ski|bb|",
    position: new google.maps.LatLng(element.lat, element.lon),
    optimized: true,
    map: map
  });

  return marker;
}
*/
/* Returns a blue color code for outbound vehicles or a red color code for inbound vehicles 
function getColor(element) {
  return ("FF6450");
}*/

