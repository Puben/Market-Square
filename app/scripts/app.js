'use strict';


var map;

initializeMap();
/*****************/
/*  GOOGLE MAPS  */
/*****************/
/* Initializes Google Maps */
function initializeMap() {
    console.log("in function initializeMap");
    // Get the location as a Google Maps latitude-longitude object
    var loc = new google.maps.LatLng("55.6834544","12.5858016");

    // Create the Google Map
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: loc,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}

