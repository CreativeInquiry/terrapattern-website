// Setup Palette
var SELECTED_COLOR = "goldenrod";
var PRIMARY_TILE_COLOR = "blue";
var BACKGROUND_COLOR = "#255";
var FRAME_COLOR = "#808080";
var DEFAULT_TILE_COLOR = "white";
var AXIS_COLOR = "#909090";



/*----------------------------------------------------------------------------- 
This is a p5.js wrapper for the two small graphical displays.  One is the 
"tsne" display, which is a 2d cluster of a dimensionally-reduced representation
of the various pins.  The other is a "minmap", which is a helpful display of
where you are positioned within the map.

There are no externally controllable functions exposed, but it does call 
"gotoPin" and it does check for the list of pins and the currently selected
pin on each frame.

This could be made more efficient if needed by moving to an event-based 
drawing style when not being interacted with.
-----------------------------------------------------------------------------*/
var p5Map = function(p) {
  var GUTTER = 10;
 
  var closestDot;
  
  // bounding boxes for the subwindows
  var tsneFrameWidth;
  var tsneFrameHeight;
  var tsneFrameTop; 
  var tsneFrameLeft;

  var minmapFrameWidth;
  var minmapFrameHeight;
  var minmapFrameTop; 
  var minmapFrameLeft;
  

  p.setup = function() {
    p.createCanvas(100, 100);
    recalulateCanvasSize();
  }

  p.draw = function() {

    p.clear();

    var pins = terrapatternMap.getPins();
    var currentPin = terrapatternMap.getCurrentPin();

    drawTsne(pins,currentPin);
    drawMinmap(pins,currentPin);
  }


  // p5 Event Handlers
  p.windowResized = recalulateCanvasSize;

  p.mousePressed = function() {
    if (mouseInBounds(tsneFrameLeft,tsneFrameLeft+tsneFrameWidth,tsneFrameTop,tsneFrameTop+tsneFrameHeight) && closestDot) {
      terrapatternMap.gotoPin(closestDot.id);
    }
  }


  // Helper Functions
  function mouseInBounds(x1,x2,y1,y2) {
    return (p.mouseX > x1 && p.mouseX < x2 && p.mouseY > y1 && p.mouseY < y2) 
  }

  function drawDot(dot){
    var radius = (dot == closestDot) ? 8 : 4;
    dot.isFirst ?  p.fill(PRIMARY_TILE_COLOR) : p.fill(DEFAULT_TILE_COLOR);
    if (dot.isSelected) {
      p.fill(SELECTED_COLOR);
    }
    p.ellipse(dot.x,dot.y,radius,radius);
  }

  function recalulateCanvasSize() {
    var availableWidth = $('#mini_displays').width();
    var mapRatio = $('#main-map').height() / $('#main-map').width();
    var desiredHeight = ((availableWidth-GUTTER)/2)*mapRatio;

    p.resizeCanvas(availableWidth,desiredHeight);

    tsneFrameWidth    = p.width/2-GUTTER/2;
    tsneFrameHeight   = p.height;
    tsneFrameTop      = 0;
    tsneFrameLeft     = p.width/2+GUTTER;
   
    minmapFrameWidth  = p.width/2-GUTTER/2;
    minmapFrameHeight = p.height;
    minmapFrameTop    = 0;
    minmapFrameLeft   = 0;
  }


  // Drawing Functions
  function drawTsne(pins, currentPin) {

    // draw the background
    p.push();
    p.translate(tsneFrameLeft,tsneFrameTop);
    var pinCoordinate, pinX, pinY;
    var tsneDots = [];

    p.noStroke();
    p.fill(FRAME_COLOR);
    p.rect(0,0,tsneFrameWidth,tsneFrameHeight)

    p.stroke(AXIS_COLOR);
    p.line(2,tsneFrameHeight/2,tsneFrameWidth-2,tsneFrameHeight/2);
    p.line(tsneFrameWidth/2,2,tsneFrameWidth/2,tsneFrameHeight-2);
    p.noStroke();
    p.pop();

    // stop drawing unless there are pins
    if (pins == undefined) { return;}

    // build pin list
    pins.forEach(function(pin, index) {
      pinCoordinate = pin.getProperty("cluster");
      obj = {};
      obj.x = p.map(pinCoordinate.x,-1,1,tsneFrameLeft,tsneFrameLeft+tsneFrameWidth);
      obj.y = p.map(pinCoordinate.y,-1,1,tsneFrameTop,tsneFrameTop+tsneFrameHeight);
      obj.isFirst = (index == 0);
      obj.id = pin.getId();
      obj.isSelected = (currentPin == obj.id);

      if (mouseInBounds(tsneFrameLeft,tsneFrameLeft+tsneFrameWidth,tsneFrameTop,tsneFrameTop+tsneFrameHeight)) { 
        if (obj.isFirst) {
          closestDot = obj;
        }
        else if (p.dist(p.mouseX, p.mouseY, obj.x, obj.y) < p.dist(p.mouseX, p.mouseY, closestDot.x, closestDot.y)) {
          closestDot = obj;
        }
      }
      tsneDots.push(obj)    
    })

    //draw the pins
    p.noStroke();
    tsneDots.forEach(drawDot)
  }

  function drawMinmap(pins, currentPin) {
    // draw the background
    p.push();
    p.translate(minmapFrameLeft,minmapFrameTop);
    p.noStroke();
    p.fill(FRAME_COLOR);
    p.rect(0,0,minmapFrameWidth,minmapFrameHeight)

    if (google == undefined) { return;}


    var bottomLeftPoint = terrapatternMap.getProjection().fromLatLngToPoint(  new google.maps.LatLng({lat: bounding_box.sw_lat, lng: bounding_box.sw_lng}))
    var topRightPoint = terrapatternMap.getProjection().fromLatLngToPoint( new google.maps.LatLng({lat: bounding_box.ne_lat, lng: bounding_box.ne_lng}))
    
    var mapHeight = Math.abs(bottomLeftPoint.y - topRightPoint.y);
    var mapWidth = Math.abs(bottomLeftPoint.x - topRightPoint.x);
    var mapRatio = mapWidth / mapHeight;
    var boxRatio = minmapFrameWidth / minmapFrameHeight;

    var xOffset, yOffset 
    if (mapRatio > boxRatio) {
      xOffset = 0;
      yOffset = (minmapFrameHeight - (minmapFrameWidth / mapRatio))/2;
    } 
    else {
      xOffset = (minmapFrameWidth - (minmapFrameHeight / mapRatio))/2;
      yOffset = 0;
    }

    p.stroke(AXIS_COLOR);
    p.beginShape();
    var x,y;
    var border = 10;
    boundary.geometry.coordinates[1].forEach(function(point){
      x = p.map(point[0],bounding_box.sw_lng, bounding_box.ne_lng,border+xOffset,minmapFrameWidth  - (border+xOffset));
      y = p.map(point[1],bounding_box.ne_lat, bounding_box.sw_lat,border+yOffset,minmapFrameHeight - (border+yOffset));
      p.vertex(x,y);
    })
    p.endShape(p.close);

    p.noStroke();
    p.pop();

    // stop drawing unless there are pins
    if (pins == undefined) { return;}

  }

}

// Create the P5 Object.
var p5MapCanvas = new p5(p5Map, 'mini_displays');




/*----------------------------------------------------------------------------- 
This is a wrapper around both the main map and the thumnail display, as
well as containing most of the main functions.  

GETTERS AND SETTERS

  getPins(): A getter for the list of pins available.
  getCurrentPin(): A getter for the currently selected pin.
  getProjection: A getter for the current map's projection

FUNCTIONS

  initialize()

  This will build the map system and set everything up.  It requires that the 
  google maps API be loaded, and is used as a callback argument for the 
  library's loading.

  gotoPage(pageNumber)

  This will set the thumbnail grid to the page given.  It is zero-indexed,
  so page 0 is the first page, etc.
  
  gotoPin(pid_id)
  
  This will select a specific pin.  It should be passed the desired pin's ID
  as a string.  The pin ids are currently their filenames as provided by the
  search API.


-----------------------------------------------------------------------------*/
var terrapatternMap = (function(){
  // CONSTANTS

  // Explicitly magic numbers.  
  var LAT_OFFSET = 0.0005225;
  var LNG_OFFSET = 0.0006865;

  var THUMBNAILS_PER_PAGE = 4*6;

  var THE_WHOLE_WORLD = [
          [0, 90],
          [180, 90],
          [180, -90],
          [0, -90],
          [-180, -90],
          [-180, 0],
          [-180, 90],
          [0, 90]
  ];
  var BOUNDARY_STYLE = {
      strokeWeight: 0,
      fillColor: "#000000",
      fillOpacity: .7
  };
  var MAP_OPTIONS = {
            center: {lat: map_center.lat, lng: map_center.lng},
            zoom: 17,
            mapTypeId: "satellite",
            mapTypeControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            tilt: 0,
            maxZoom: 19,
            minZoom: 10
  };

  //Internal module variables
  var lastValidCenter;
  var defaultBounds;
  var map;
  var pinIds = [];
  var tileRectangle; 
  var pins;
  var paginationCurrentPage;
  var searchBox;
  var rawGeoJson;
  var lastSelected;

  function getCurrentTileBounds(lat,lng) {
    lat = lat-LAT_OFFSET/2;
    lng = lng-LNG_OFFSET/2;
    var minLng = bounding_box.sw_lng;
    var minLat = bounding_box.sw_lat;

    var north = minLat + Math.floor((lat-minLat)/LAT_OFFSET)*LAT_OFFSET+LAT_OFFSET/2;
    var south = minLat + Math.ceil((lat-minLat)/LAT_OFFSET)*LAT_OFFSET+LAT_OFFSET/2;
    var west = minLng + Math.floor((lng-minLng)/LNG_OFFSET)*LNG_OFFSET+LNG_OFFSET/2;
    var east = minLng + Math.ceil((lng-minLng)/LNG_OFFSET)*LNG_OFFSET+LNG_OFFSET/2;

    return {
      north: north,
      south: south,
      east:  east,
      west: west,
    };
  }

  function goToPin(id) {
    // console.log("going to pin", id)
    var pinToSelect = map.data.getFeatureById(id);
    latLng = pinToSelect.getGeometry().get();
    map.setCenter(latLng);
    map.setZoom(18);
    handleDrawingRectangle(null, latLng);
    lastSelected = id;
  }

  //-----------------
  function getTileImage(lat,lng,id="",size=256) {
    var url = "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&zoom=19";
    url = url + "&center=" + lat + "," + lng;
    url = url + "&size=" + size + "x" + size;
    url = url + "&key=" + MAPS_API_KEY;
    return "<div class='location_tile' id='"+id+"'><img alt='' src='"+url+"'/></div>"
  } 

  //-----------------
  function hideEverythingBut(and_then_show=null) {
    $('#result-grid').addClass("hidden");
    $('#no-results').addClass("hidden");
    $('#waiting').addClass("hidden");
    $(and_then_show).removeClass("hidden");
  }

  //-----------------
  function handlePan() {
    if (defaultBounds.contains(map.getCenter())) {
        // still within valid bounds, so save the last valid position
        lastValidCenter = map.getCenter();
        return; 
    }
    // not valid anymore => return to last valid position
    map.panTo(lastValidCenter);
  }

  //-----------------
  function handleSearch() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    var new_location = places[0];
    map.panTo(new_location.geometry.location);
    map.setZoom(18);
  }

  //-----------------
  function handleClick(e) {
      
      hideEverythingBut('#waiting');
      // console.log("searching");


      // var data = 
      var data = tileRectangle.getBounds().getCenter();
      var results = $.get("/search", {lat: data.lat(), lng: data.lng()});
      results.done(handleNewPins);
  }

  function handleNewPins(e) {

    // setup ui
    hideEverythingBut('#result-grid');
   
    // cleanup old pins
    pinIds.forEach(function(p) {
      map.data.remove(map.data.getFeatureById(p));
    })

    rawGeoJson = e;
    pins = map.data.addGeoJson(rawGeoJson);

    // add new pins
    var pinBounds = new google.maps.LatLngBounds();
    pinIds = [];
    for (var i = 0; i < pins.length; i++) {
      pinIds.push(pins[i].getId());
      pinBounds.extend( pins[i].getGeometry().get());
    }

    showThumbnails(0);

    // zoom
    map.fitBounds(pinBounds);
  }


  function drawPagination(currentPage) {
    paginationCurrentPage = currentPage;

    var totalNumberOfPages = Math.ceil(pins.length/THUMBNAILS_PER_PAGE);
    var str = "<nav>"
    str    += "<ul class='pagination pagination-sm'>"

    str    += "<li class='"
    if (currentPage == 0){str +="disabled";}
    str    += "'><a href='#'>&laquo;</a></li>"
    
    for (var q1 = 1; q1 <=totalNumberOfPages; q1++) {
      str   += "<li class='"
      if (q1 == currentPage+1) {str   += "active";}
      str   += "'><a href='#'>"+q1+"</a></li>"
    }

    str    += "<li class='"
    if (currentPage == totalNumberOfPages-1 ){str +="disabled";}
    str    += "'><a href='#'>&raquo;</a></li>"

    str    += "</ul>"
    str    += "</nav>"
    $("#results_pagination").html(str);
  }

  function showThumbnails(page) {
    var pinId, pinGeo; 

    // cleanup
    $('.location_tile').remove();

    // math the things
    var startingThumb = THUMBNAILS_PER_PAGE*page;
    var numberOfThumbs = pins.length > startingThumb+THUMBNAILS_PER_PAGE ? THUMBNAILS_PER_PAGE : pins.length-startingThumb;

    // add the tiles
    for (var i = startingThumb; i < startingThumb+numberOfThumbs; i++) {
      pinId = pins[i].getId();
      pinGeo = pins[i].getGeometry().get();
      $("#results_grid").append(getTileImage(pinGeo.lat(), pinGeo.lng(), pinId));
    }
    drawPagination(page);
  }


  //-----------------
  function initMap() {
    tileRectangle = new google.maps.Rectangle();



    // Set the search boundary (just a hint, not a requirement)
    defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(bounding_box.sw_lat, bounding_box.sw_lng),
      new google.maps.LatLng(bounding_box.ne_lat, bounding_box.ne_lng)
    );

    // Initialize the map object
    map = new google.maps.Map(document.getElementById('main-map'), MAP_OPTIONS);  
    lastValidCenter = map.getCenter();

    // Initialize the grey boundary
    boundary.geometry.coordinates.unshift(THE_WHOLE_WORLD);
    map.data.addGeoJson(boundary);
    map.data.setStyle(BOUNDARY_STYLE);

    // Set up the search box
    var input = document.getElementById('search_box');
    searchBox = new google.maps.places.SearchBox(input, {bounds: defaultBounds});
    searchBox.setBounds(map.getBounds());
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Set up the event handlers
    map.addListener('center_changed',handlePan);
    map.addListener('mousemove',handleDrawingRectangle);
    map.addListener('click', handleClick);
    searchBox.addListener('places_changed', handleSearch);

    $("#results_pagination").on("click", "li", handlePaginationClick)    
    $("#results_grid").on("click", ".location_tile", function(){
      goToPin($(this).attr("id"))
    })
  }

  function handlePaginationClick(e) {
    e.preventDefault();
    var pagenum = $(this).text();
    // console.log("pagenum",pagenum);
    if ($(this).hasClass("disabled")) {return}
    else if (pagenum-1 == paginationCurrentPage) {return}
    else if (pagenum == "«") {showThumbnails(paginationCurrentPage - 1)}
    else if (pagenum == "»") {showThumbnails(paginationCurrentPage + 1)}
    else { showThumbnails(pagenum -1)};
  }

  function handleDrawingRectangle(e, point = false) {
    var point = point ? point : e.latLng;
    var bounds = getCurrentTileBounds(point.lat(), point.lng())

    // var rectBounds = tileRectangle.getBounds();
    // if (rectBounds && rectBounds.equals(bounds)) {
    //   console.log('dup');
    //   return};
    // console.log("centered at:", bounds)
    tileRectangle.setOptions({
      strokeColor: '#000000',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#FFFFFF',
      fillOpacity: 0.1,
      clickable: false,
      map: map,
      bounds: bounds
    });
  }


  // Expose the module's interface to the world (you naughty code, you).
  return {
    initialize: initMap,
    gotoPage: showThumbnails,
    gotoPin: goToPin,
    getPins: function() { return pins},
    getCurrentPin: function() {return lastSelected},
    getProjection: function() {return map.getProjection()}
  };
}());


