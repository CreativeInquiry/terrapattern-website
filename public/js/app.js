  var pointSource = new mapboxgl.GeoJSONSource();


function hideStuff() {
  $('#result-grid').addClass("hidden");
  $('#no-results').addClass("hidden");
  $('#waiting').addClass("hidden");
}

function handleClick(e) {
    
    hideStuff();
     $('#waiting').removeClass("hidden");
    var roundAmount = 1000;
    
    $("#toolbox .lat").text("Lat: "+ Math.round(e.lngLat.lat*roundAmount)/roundAmount);
    $("#toolbox .lng").text("Lng: "+ Math.round(e.lngLat.lng*roundAmount)/roundAmount);
    
    var data = {lat: e.lngLat.lat, lng: e.lngLat.lng}
    var results = $.get("/search", data);
    results.done(function(e){
      hideStuff();
       $('#result-grid').removeClass("hidden");
      pointSource.setData(e);

      var bb =  geojsonExtent(e);
      map.fitBounds([[bb[0],bb[1]],[bb[2],bb[3]]], {padding: 20});
    });
}



function gotoPoint(lat, lng) {
  map.flyTo({center: [lat, lng]});
}

function initializePoints() {
  map.addSource('points',pointSource);
  map.addLayer({
      "id": "point",
      "source": "points",
      "type": "circle",
      "paint": {
          "circle-radius": 10,
          "circle-color": "#007cbf"
      }
  });
  console.log("init");
}

mapboxgl.accessToken = 'pk.eyJ1Ijoid29ya2VyZ25vbWUiLCJhIjoiTUFwelJBcyJ9.ZDFQRHwEJoJbApNIYw_CQw';
var map = new mapboxgl.Map({
    container: 'main-map', // container id
    center: [-79.9436, 40.4433],
    style: 'mapbox://styles/workergnome/cilxtm6eb008f9om1duwmdbdk',
    zoom: 15 // starting zoom
})

map.on('load', initializePoints);
map.on('click', handleClick);

