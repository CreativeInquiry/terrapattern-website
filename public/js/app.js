// For 
function getTileImage(lat,lng,size=200) {
  var url = "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&zoom=19";
  url = url + "&center=" + lng + "," + lat;
  url = url + "&size=" + size + "x" + size;
  url = url + "&key=" + MAPS_API_KEY;
  return url
} 

// function hideStuff() {
//   $('#result-grid').addClass("hidden");
//   $('#no-results').addClass("hidden");
//   $('#waiting').addClass("hidden");
// }

// function handleClick(e) {
    
//     hideStuff();
//      $('#waiting').removeClass("hidden");
//     var roundAmount = 1000;
    
//     // $("#toolbox .lat").text("Lat: "+ Math.round(e.lngLat.lat*roundAmount)/roundAmount);
//     // $("#toolbox .lng").text("Lng: "+ Math.round(e.lngLat.lng*roundAmount)/roundAmount);
    
//     var data = {lat: e.lngLat.lat, lng: e.lngLat.lng}
//     var results = $.get("/search", data);
//     results.done(function(e){
//       hideStuff();
//        $('#result-grid').removeClass("hidden");
//       pointSource.setData(e);

//       var bb =  geojsonExtent(e);
//       map.fitBounds([[bb[0],bb[1]],[bb[2],bb[3]]], {padding: 20});
//     });
// }

// function gotoPoint(lat, lng) {
//   map.flyTo({center: [lat, lng]});
// }

// function initializePoints() {
//   map.addSource('points',pointSource);
//   map.addLayer({
//       "id": "point",
//       "source": "points",
//       "type": "circle",
//       "paint": {
//           "circle-radius": 10,
//           "circle-color": "#007cbf"
//       }
//   });
//   console.log("init");
// }

var lastValidCenter;
var defaultBounds;
var map;

function initMap() {

  var mapOptions = {
            center: {lat: map_center.lat, lng: map_center.lng},
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            mapTypeControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            tilt: 0,
            maxZoom: 19,
            minZoom: 9
  }

  // Set the search boundary (just a hint, not a requirement)
  defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(bounding_box.sw_lat, bounding_box.sw_lng),
    new google.maps.LatLng(bounding_box.ne_lat, bounding_box.ne_lng));


  // Initialize the map object
  map = new google.maps.Map(document.getElementById('main-map'), mapOptions);  
  lastValidCenter = map.getCenter();


  var the_whole_world = [
          [0, 90],
          [180, 90],
          [180, -90],
          [0, -90],
          [-180, -90],
          [-180, 0],
          [-180, 90],
          [0, 90]
  ];
  
  boundary.geometry.coordinates.unshift(the_whole_world);
  map.data.addGeoJson(boundary, {idPropertyName: "region_boundary"});
  map.data.setStyle({
    strokeWeight: 0,
    fillColor: "#000000",
    fillOpacity: .7
  });

  // Set up the search box
  var input = document.getElementById('search_box');
  var searchBox = new google.maps.places.SearchBox(input, {bounds: defaultBounds});
  searchBox.setBounds(map.getBounds());
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);




  // Setup the search listenter
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    var new_location = places[0];
    map.panTo(new_location.geometry.location);
  });

  // Set up the panning constraints
  google.maps.event.addListener(map, 'center_changed', function() {
      if (defaultBounds.contains(map.getCenter())) {
          // still within valid bounds, so save the last valid position
          lastValidCenter = map.getCenter();
          return; 
      }
      // not valid anymore => return to last valid position
      map.panTo(lastValidCenter);
  });

}