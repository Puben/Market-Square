'use strict';

var map;
var x = document.getElementById("demo");

// Set the center as Central Copenhagen
var locations = {
  "Copenhagen": [55.6834544,12.5858016]
};
var center = locations["Copenhagen"];
var radiusInKm = 1;

var fireBaseRef = new Firebase("https://marketsquare.firebaseio.com/")

var geoFire = new GeoFire(fireBaseRef.child("geofire"));

/*************/
/*  GEOQUERY */
/*************/
// Keep track of all of the vehicles currently within the query
var adsInQuery = {};

// Create a new GeoQuery instance
var geoQuery = geoFire.query({
  center: center,
  radius: radiusInKm
});

/* Adds new vehicle markers to the map when they enter the query */
geoQuery.on("key_entered", function(adId, adLocation) {
  // Specify that the vehicle has entered this query
  adId = adLocation.split(":")[1];
  adsInQuery[adId] = true;

  // Look up the vehicle's data in the Transit Open Data Set
  fireBaseRef.child("ads").child("1").once("value", function(dataSnapshot) {
    // Get the vehicle data from the Open Data Set
    ad = dataSnapshot.val();
    console.log("--> Geo_fire Test -" + ad );
    // If the vehicle has not already exited this query in the time it took to look up its data in the Open Data
    // Set, add it to the map
    if (ad !== null && adsInQuery[adId] === true) {
      // Add the vehicle to the list of vehicles in the query
      adsInQuery[adId] = ad;

      // Create a new marker for the vehicle
      ad.marker = createAdMarker(ad, getColor(ad));
    }
  });
});





/*****************/
/*  GOOGLE MAPS  */
/*****************/
/* Initializes Google Maps */
function initializeMap(lodash) {
    console.log("in function initializeMap");
    // Get the location as a Google Maps latitude-longitude object
    var loc = new google.maps.LatLng(center[0], center[1]);

    // Create the Google Map
        map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: loc,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

          // Create a draggable circle centered on the map
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

  //Update the query's criteria every time the circle is dragged
  var updateCriteria = _.debounce(function() {
    var latLng = circle.getCenter();
    geoQuery.updateCriteria({
      center: [latLng.lat(), latLng.lng()],
      radius: radiusInKm
    });
  }, 10);
  google.maps.event.addListener(circle, "drag", updateCriteria);

};



function getLocation() {
    if (navigator.geolocation) {
	console.log("sending location from app.js");
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
};;

function showPosition(position) {
  document.getElementById("latitude").value = position.coords.latitude;
  document.getElementById("longitude").value = position.coords.longitude;
    console.log("here is your lattitude from app.js " + document.getElementById("latitude").value);
    //x.innerHTML = "Latitude: " + position.coords.latitude +
    //"<br>Longitude: " + position.coords.longitude;
};

/* Adds a marker for the inputted ad to the map */
function createAdMarker(element, elementColor) {
  var marker = new google.maps.Marker({
    icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=ski|bb|",
    position: new google.maps.LatLng(element.lat, element.lon),
    optimized: true,
    map: map
  });

  return marker;
};

function getColor(element) {
  return ("FF6450");
};


