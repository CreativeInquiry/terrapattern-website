/*-----------------------------------------------------------------------------
# Terrapattern User Interface Code
#### written by: David Newbury (@workergnome)


This is the main interface code for the Terrapattern user interface.
It uses p5.js and the Google Maps API to generate four content sections:

* The Map, which is a google map, constrained to a specific geographical region
* The Minmap, which is a small display of the geographical region.
* The TSNE, which is dimension-reduced display of the search results.
* The Tiles, which are a set of thumbnails of the search results.

This code assumes that several global variables have been set before
this code is initialized.  These are:

    var MAPS_API_KEY = <A Google Maps API key>;
    var BOUNDARY     = <a geoJSON object containing the outline of the region>;
    var BOUNDING_BOX = {
                          sw_lat: FLOAT,
                          sw_lng: FLOAT,
                          ne_lat: FLOAT,
                          nw_lng: FLOAT
                        };
    var MAP_CENTER   =  {
                          lat: FLOAT,
                          lng: FLOAT
                        }

-----------------------------------------------------------------------------*/




/*-----------------------------------------------------------------------------
## Configurable Settings:

These are the magic number an strings that can be set to modify the appearance
of the interface.
-----------------------------------------------------------------------------*/

// Color Palette
var FRAME_COLOR = "#b2bdb3";                       // Color of the graph backgrounds
var WATER_COLOR = "#c8d0c9";                       // Color of the graph backgrounds
var AXIS_COLOR = "#efefec";                        // Color of the graph elements
var SELECTED_COLOR = "#3887be";                    // Color of the current dot/pin
var PRIMARY_TILE_COLOR = "#2ecc71";                // Color of the searched-for dot/pin
var DEFAULT_TILE_COLOR = "rgba(255,255,255,0.5)";  // Color of a normal dot/pin
var HOVERED_TILE_COLOR = "rgba(255,255,255,1)";    // Color of a hovered-over dot/pin
var VIEWPORT_BOX_COLOR = "rgba(255,255,255,0.45)"; // Color of the viewport box

// Magic Numbers
var SMALL_RADIUS = 4;             // Size of a normal dot (in pixels)
var MEDIUM_RADIUS = 6;            // Size of a hovered dot (in pixels)
var LARGE_RADIUS = 10;            // Size of a selected dot (in pixels)
var GUTTER = 32;                  // Border between the two graphs (in pixels)
var THUMBNAILS_PER_PAGE = 4 * 6;  // The number of tile results to show per-page


/*-----------------------------------------------------------------------------
## Minmap and TSNE grid code

This is the p5.js wrapper for the two small graphical displays.  One is the
"tsne" display, which is a 2d cluster of a dimensionally-reduced representation
of the various pins.  The other is a "minmap", which is a helpful display of
where the main map and the various poins are located within the geographical
region.

There are no externally controllable functions exposed, but it does call
"gotoPin" and it does check for the list of pins and the currently selected
pin on each frame.

This could be made more efficient if needed by moving to an event-based
drawing style when not being interacted with.
-----------------------------------------------------------------------------*/
var p5Map = function(p) {

  "use strict";
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
  var waterShape = [];


  //-----------------------------------------------------------------
  // Base P5 Functions
  //-----------------------------------------------------------------
  p.setup = function() {
    p.createCanvas(100, 100);
    recalulateCanvasSize();
  };




  p.draw = function() {
    closestDot = null;

    var pins = terrapatternMap.getPins();
    var currentPin = terrapatternMap.getCurrentPin();

    p.clear();
    var tsneDots = updateTsne(pins,currentPin);
    var minmapDots = updateMinmap(pins, currentPin);
    if (closestDot) {
      addClosest(tsneDots);
      addClosest(minmapDots);
    }
    drawTsne(tsneDots);
    drawMinmap(minmapDots);
    if (pins) {
      minmapDots.forEach(function(dot) {
        if (dot.isHovered || dot.isFirst || dot.isSelected) {
          drawDot(dot);
        }
      })
      tsneDots.forEach(function(dot) {
        if (dot.isHovered || dot.isFirst || dot.isSelected) {
          drawDot(dot);
        }
      })
    }
  };


  function addClosest(dots) {
    dots.forEach(function(dot) {
      if (dot.id == closestDot.id) {
        dot.isHovered = true;
      }
    });
  }
 

  //-----------------------------------------------------------------
  // p5 Event Handlers
  //-----------------------------------------------------------------
  p.windowResized = recalulateCanvasSize;

  p.mousePressed = function() {
    if (mouseInTsneBounds() && closestDot) {
      terrapatternMap.gotoPin(closestDot.id);
    }
    else if (mouseInMinmapBounds() && closestDot) {
      terrapatternMap.gotoPin(closestDot.id);
    }
  };


  //-----------------------------------------------------------------
  // Drawing Functions
  //-----------------------------------------------------------------
  function updateTsne(pins, currentPin) {

    // stop drawing unless there are pins
    if (pins == undefined) { return;}

    var pinCoordinate, pinX, pinY;
    var tsneDots = [];

    // build pin list
    pins.forEach(function(pin, index) {
      pinCoordinate = pin.getProperty("cluster");
      var obj = {};
      obj.x = p.map(pinCoordinate.x,-1,1,tsneFrameLeft + LARGE_RADIUS,tsneFrameLeft+tsneFrameWidth- LARGE_RADIUS);
      obj.y = p.map(pinCoordinate.y,-1,1,tsneFrameTop + LARGE_RADIUS,tsneFrameTop+tsneFrameHeight - LARGE_RADIUS);
      obj.isFirst = (index == 0);
      obj.id = pin.getId();
      obj.isSelected = (currentPin == obj.id);

      if (mouseInTsneBounds()) {
        if (obj.isFirst) {
          closestDot = obj;
        }
        else if (p.dist(p.mouseX, p.mouseY, obj.x, obj.y) < p.dist(p.mouseX, p.mouseY, closestDot.x, closestDot.y)) {
          closestDot = obj;
        }
      }
      else if (terrapatternMap.hoveredTile && obj.id == terrapatternMap.hoveredTile) {
          closestDot = obj;
      }
      tsneDots.push(obj);
    });
    return tsneDots;
  }

  function drawTsne(tsneDots) {

    // draw the background
    p.push();
    p.translate(tsneFrameLeft,tsneFrameTop);

    p.noStroke();
    p.fill(FRAME_COLOR);
    p.rect(0,0,tsneFrameWidth,tsneFrameHeight);

    p.stroke(AXIS_COLOR);
    // p.line(2,tsneFrameHeight/2,tsneFrameWidth-2,tsneFrameHeight/2);
    // p.line(tsneFrameWidth/2,2,tsneFrameWidth/2,tsneFrameHeight-2);
    p.noStroke();
    p.pop();

    //draw the pins
    p.noStroke();
    if(tsneDots) {
      tsneDots.forEach(drawDot);
    }
  }

    //-----------------------------------------------------------------
  
  function updateMinmap(pins, currentPin) {
    // stop drawing unless there are pins
    if (pins == undefined) { return;}

    // build pin list
    var pinCoordinates, pinXY;
    var minmapDots = [];
    pins.forEach(function(pin, index) {
      pinCoordinates = pin.getGeometry().get();
      pinXY = getPointfromLatLng(pinCoordinates.lat(),pinCoordinates.lng());
      var obj = {};
      obj.x = pinXY.x;
      obj.y = pinXY.y;
      obj.isFirst = (index == 0);
      obj.id = pin.getId();
      obj.isSelected = (currentPin == obj.id);

      if (mouseInMinmapBounds()) {
        if (obj.isFirst) {
          closestDot = obj;
        }
        else if (p.dist(p.mouseX, p.mouseY, obj.x, obj.y) < p.dist(p.mouseX, p.mouseY, closestDot.x, closestDot.y)) {
          closestDot = obj;
        }
      } else if (terrapatternMap.hoveredTile()) {
          if  (obj.id == terrapatternMap.hoveredTile()){
            closestDot = obj;
          }
      }
      minmapDots.push(obj);
    });
    return minmapDots;
  }
  function drawMinmap(minmapDots) {

    // draw the background
    p.push();
    p.translate(minmapFrameLeft,minmapFrameTop);
    p.noStroke();
    p.fill(AXIS_COLOR);
    p.rect(0,0,minmapFrameWidth,minmapFrameHeight);
    p.pop();

    // Stop here unless the map has been initialized.
    if (google == undefined) { return;}

    // Actually draw the minmap border
    var pos;
    p.noStroke();
    p.fill(FRAME_COLOR);
    p.beginShape();
    BOUNDARY.geometry.coordinates[1].forEach(function(point){
      pos = getPointfromLatLng(point[1],point[0]);
      p.vertex(pos.x,pos.y);
    });
    p.endShape(p.close);

    if (WATER) {

      if (waterShape.length == 0) {
        WATER.coordinates.forEach(function(poly){
          poly.forEach(function(shape){ 
            var shapeData = []
            shape.forEach(function(point){
              shapeData.push(getPointfromLatLng(point[1],point[0]));
            });
            waterShape.push(shapeData)
          })
        })
      }

      p.fill(WATER_COLOR);
      waterShape.forEach(function(shape) {
        p.beginShape();
        shape.forEach(function(pos){
          p.vertex(pos.x,pos.y);
        });
        p.endShape();
      });
    }

    // draw Viewport Box
    var viewableBounds = terrapatternMap.getBounds();
    var ne = viewableBounds.getNorthEast();
    var sw = viewableBounds.getSouthWest();

    var p1 = getPointfromLatLng(ne.lat(), ne.lng());
    var p2 = getPointfromLatLng(sw.lat(), sw.lng());
    p.fill(VIEWPORT_BOX_COLOR);
    if (p1.x > minmapFrameLeft + minmapFrameWidth) {
      p1.x = minmapFrameLeft + minmapFrameWidth;
    }
    if (p2.y > minmapFrameTop + minmapFrameHeight) {
      p2.y = minmapFrameTop + minmapFrameHeight;
    }
    p.rect(p2.x,p1.y,Math.abs(p2.x-p1.x),Math.abs(p2.y-p1.y));
    

    //draw the pins
    p.noStroke();
    if(minmapDots) {
      minmapDots.forEach(drawDot);
    }
  }


  //-----------------------------------------------------------------
  // Helper Functions
  //-----------------------------------------------------------------

  function mouseInBounds(x1,x2,y1,y2) {
    return (p.mouseX > x1 && p.mouseX < x2 && p.mouseY > y1 && p.mouseY < y2);
  }

  function mouseInTsneBounds() {
    return mouseInBounds(tsneFrameLeft,tsneFrameLeft+tsneFrameWidth,tsneFrameTop,tsneFrameTop+tsneFrameHeight);
  }

  function mouseInMinmapBounds() {
    return mouseInBounds(minmapFrameLeft,minmapFrameLeft+minmapFrameWidth,minmapFrameTop,minmapFrameTop+minmapFrameHeight);
  }

  //-----------------------------------------------------------------
  function drawDot(dot){
    p.noStroke();
    p.fill(DEFAULT_TILE_COLOR);
    var radius = SMALL_RADIUS;
    if (dot.isHovered) {
      p.fill(HOVERED_TILE_COLOR);
    }
    if (dot.isFirst) {
      radius = MEDIUM_RADIUS;
      p.fill(PRIMARY_TILE_COLOR);
    }
    if (dot.isSelected) {
     p.fill(SELECTED_COLOR);
     radius = MEDIUM_RADIUS;
    }
    // always make the hovered dot bigger
    if (dot.isHovered) {
      radius = LARGE_RADIUS;
    }
    p.ellipse(dot.x,dot.y,radius,radius);
  }

  //-----------------------------------------------------------------
  function recalulateCanvasSize() {
    var availableWidth = $('#mini_displays').width();
    var mapRatio = 1;//$('#main-map').height() / $('#main-map').width();
    var desiredHeight = ((availableWidth-GUTTER)/2)*mapRatio;

    p.resizeCanvas(availableWidth,desiredHeight);

    tsneFrameWidth    = p.width/2-GUTTER/2;
    tsneFrameHeight   = p.height;
    tsneFrameTop      = 0;
    tsneFrameLeft     = p.width/2+GUTTER/2;

    minmapFrameWidth  = p.width/2-GUTTER/2;
    minmapFrameHeight = p.height;
    minmapFrameTop    = 0;
    minmapFrameLeft   = 0;
    waterShape = [];
  }



  //-----------------------------------------------------------------
  function getPointfromLatLng(lat,lng) {
    var x,y;

    // Calculations for scaling the minmap appropriately.
    // TODO:  Much of this is static or could be done on resize.
    var bottomLeftPoint = terrapatternMap.getProjection().fromLatLngToPoint(  new google.maps.LatLng({lat: BOUNDING_BOX.sw_lat, lng: BOUNDING_BOX.sw_lng}));
    var topRightPoint = terrapatternMap.getProjection().fromLatLngToPoint( new google.maps.LatLng({lat: BOUNDING_BOX.ne_lat, lng: BOUNDING_BOX.ne_lng}));
    var mapHeight = Math.abs(bottomLeftPoint.y - topRightPoint.y);
    var mapWidth = Math.abs(bottomLeftPoint.x - topRightPoint.x);
    var mapRatio = mapWidth / mapHeight;
    var boxRatio = minmapFrameWidth / minmapFrameHeight;
    var xOffset, yOffset;

    if (mapRatio > boxRatio) {
      xOffset = 0;
      yOffset = (minmapFrameHeight - (minmapFrameWidth / mapRatio))/2;
    }
    else {
      xOffset = (minmapFrameWidth - (minmapFrameHeight / boxRatio))/2;
      yOffset = 0;
    }

    x = p.map(lng,BOUNDING_BOX.sw_lng, BOUNDING_BOX.ne_lng,LARGE_RADIUS+xOffset,minmapFrameWidth  - (LARGE_RADIUS+xOffset));
    y = p.map(lat,BOUNDING_BOX.ne_lat, BOUNDING_BOX.sw_lat,LARGE_RADIUS+yOffset,minmapFrameHeight - (LARGE_RADIUS+yOffset));
    return {x: x, y: y};
  }
};



/*-----------------------------------------------------------------------------
## Map and Tiles code

This is a wrapper around both the main map and the thumbnail displays of
tiles, as well as code that contains functions that operate on the system
as a whole.

#### GETTERS AND SETTERS

  getPins(): A getter for the list of pins available.
  getCurrentPin(): A getter for the currently selected pin.
  getProjection: A getter for the current map's projection

#### EXPOSED FUNCTIONS

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
  "use strict";

  // CONSTANTS

  // Explicitly magic numbers.
  var LAT_OFFSET = 0.0005225;
  var LNG_OFFSET = 0.0006865;

if (CITY_NAME == "miami") {
  LAT_OFFSET = 0.000620;
  LNG_OFFSET = 0.000687;
} else if (CITY_NAME == "berlin") {
  LNG_OFFSET = 0.000688;
  LAT_OFFSET = 0.000420;
} else if (CITY_NAME == "austin") {
  LNG_OFFSET = 0.0006879;
  LAT_OFFSET = 0.000595;
}

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
      fillOpacity: 0.7
  };
  var MAP_OPTIONS = {
            center: {lat: MAP_CENTER.lat, lng: MAP_CENTER.lng},
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
  var hoveredTile;

  //-----------------------------------------------------------------
  function getCurrentTileBounds(lat,lng) {
    lat = lat-LAT_OFFSET/2;
    lng = lng-LNG_OFFSET/2;
    var minLng = BOUNDING_BOX.sw_lng;
    var minLat = BOUNDING_BOX.sw_lat;

    var north = minLat + Math.floor((lat-minLat)/LAT_OFFSET)*LAT_OFFSET+LAT_OFFSET/2;
    var south = minLat + Math.ceil((lat-minLat)/LAT_OFFSET)*LAT_OFFSET+LAT_OFFSET/2;
    var west = minLng + Math.floor((lng-minLng)/LNG_OFFSET)*LNG_OFFSET+LNG_OFFSET/2;
    var east = minLng + Math.ceil((lng-minLng)/LNG_OFFSET)*LNG_OFFSET+LNG_OFFSET/2;

    var obj = {
      north: north ,
      south: south ,
      east:  east,
      west: west
    };
    // console.log('obj', obj)
    return obj;
  }

  //-----------------------------------------------------------------
  function gotoPin(id) {

    var pinNumber = pinIds.indexOf(id);

    showThumbnails(Math.floor(pinNumber/THUMBNAILS_PER_PAGE));

    $('.location_tile').removeClass("selected");
    $("#" + domIdFromId(id)).addClass("selected");

    var pinToSelect = map.data.getFeatureById(id);
    var latLng = pinToSelect.getGeometry().get();
    map.setCenter(latLng);
    map.setZoom(18);
    handleDrawingRectangle(null, latLng);
    lastSelected = id;
  }

  function domIdFromId(id) {
    if (!id) {return "";}
    return id.replace(/\./g, "");
  }
  //-----------------------------------------------------------------
  function getTileImage(lat,lng,id,size) {
    if (!size) {size = 256};
    var url = "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&zoom=19";
    url = url + "&center=" + lat + "," + lng;
    url = url + "&size=" + size + "x" + size;
    url = url + "&key=" + MAPS_API_KEY;
    return "<div class='location_tile' data-original-id='"+ id +"' id='" + domIdFromId(id) + "'><img alt='' src='"+url+"'/></div>";
  }

  //-----------------------------------------------------------------
  function hideEverythingBut(and_then_show) {
    $("#searching").hide();
    $('#result-grid').addClass("hidden");
    $('#no-results').addClass("hidden");
    $('#waiting').addClass("hidden");
    if (and_then_show) {
      $(and_then_show).removeClass("hidden");
    }
  }

  //-----------------------------------------------------------------
  function handlePan() {
    if (defaultBounds.contains(map.getCenter())) {
        // still within valid bounds, so save the last valid position
        lastValidCenter = map.getCenter();
        return;
    }
    // not valid anymore => return to last valid position
    map.panTo(lastValidCenter);
  }

  //-----------------------------------------------------------------
  function handleSearch() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    var new_location = places[0];
    map.panTo(new_location.geometry.location);
    map.setZoom(18);
  }

  //-----------------------------------------------------------------
  function handleClick(e, data) {

      hideEverythingBut('#waiting');
      resetUI();

      if (!data) {
        var loc = tileRectangle.getBounds().getCenter();
        data = {lat: loc.lat(), lng: loc.lng()}
      }
      $("#searching").show();
      var results = $.get("/search", data);
      results.done(handleNewPins);
  }

  //-----------------------------------------------------------------
  function handleNewPins(data) {

    // setup ui
    hideEverythingBut('#result-grid');

    // cleanup old pins
    pinIds.forEach(function(p) {
      map.data.remove(map.data.getFeatureById(p));
    });

    rawGeoJson = data;
    pins = map.data.addGeoJson(rawGeoJson);

    pinIds = [];
    for (var i = 0; i < pins.length; i+=1) {
      pinIds.push(pins[i].getId());
    }

    var base_loc = pins[0].getGeometry().get();
    var uri = URI(document.URL);
    var prevData =  uri.query(true);
    uri.query(function(data){
      data.lat=base_loc.lat();
      data.lng=base_loc.lng();
    });

    if (!(JSON.stringify(prevData) ==  JSON.stringify(uri.query(true)))){
      history.pushState({},"",uri.toString());
    }


    gotoPin(pinIds[0]);
  }

  //-----------------------------------------------------------------
  function drawPagination(currentPage) {
    paginationCurrentPage = currentPage;

    var totalNumberOfPages = Math.ceil(pins.length/THUMBNAILS_PER_PAGE);
    var str = "<nav>";
    str    += "<ul class='pagination pagination-sm'>";

    str    += "<li class='";
    if (currentPage == 0){str +="disabled";}
    str    += "'><a href='#'>&laquo;</a></li>";

    for (var i = 1; i <=totalNumberOfPages; i+=1) {
      str   += "<li class='";
      if (i == currentPage+1) {str   += "active";}
      str   += "'><a href='#'>"+i+"</a></li>";
    }

    str    += "<li class='";
    if (currentPage == totalNumberOfPages-1 ){str +="disabled";}
    str    += "'><a href='#'>&raquo;</a></li>";

    str    += "</ul>";
    str    += "</nav>";
    $("#results_pagination").html(str);
  }

  //-----------------------------------------------------------------
  function showThumbnails(page) {
    var pinId, pinGeo;

    // cleanup
    $('.location_tile').remove();

    // math the things
    var startingThumb = THUMBNAILS_PER_PAGE*page;
    var numberOfThumbs = pins.length > startingThumb+THUMBNAILS_PER_PAGE ? THUMBNAILS_PER_PAGE : pins.length-startingThumb;

    // add the tiles
    for (var i = startingThumb; i < startingThumb+numberOfThumbs; i+=1) {
      pinId = pins[i].getId();
      pinGeo = pins[i].getGeometry().get();
      $("#results_grid").append(getTileImage(pinGeo.lat(), pinGeo.lng(), pinId));
    }
    $('#' + domIdFromId(lastSelected)).addClass("selected");
    $("#" + domIdFromId(pinIds[0])).addClass("original");

    drawPagination(page);
  }


  //-----------------------------------------------------------------
  function initMap() {

    // Create the tile square
    tileRectangle = new google.maps.Rectangle();

    // Set the search boundary (just a hint, not a requirement)
    defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(BOUNDING_BOX.sw_lat, BOUNDING_BOX.sw_lng),
      new google.maps.LatLng(BOUNDING_BOX.ne_lat, BOUNDING_BOX.ne_lng)
    );

    // Initialize the map object
    map = new google.maps.Map(document.getElementById('main-map'), MAP_OPTIONS);
    lastValidCenter = map.getCenter();

    // Initialize the grey BOUNDARY
    BOUNDARY.geometry.coordinates.unshift(THE_WHOLE_WORLD);
    map.data.addGeoJson(BOUNDARY);
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
    window.addEventListener('popstate', handlePopState);

    $("#results_pagination").on("click", "li", handlePaginationClick);
    $("#results_grid").on("click", ".location_tile", function(){
      gotoPin($(this).data("original-id"));
    });
    $("#results_grid").on("mouseover", ".location_tile", function(){
      hoveredTile = $(this).data("original-id");
    });
    $("#results_grid").on("mouseout", ".location_tile", function(){
      hoveredTile = null;
    });
    $("#export").on("click", function(e) {
      e.preventDefault();
      if (rawGeoJson) {
        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "/download");

        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "geojson");
        hiddenField.setAttribute("value", JSON.stringify(rawGeoJson));

        form.appendChild(hiddenField);

        

        document.body.appendChild(form);
        form.submit();
      }
    })


    handlePopState(null);

  }

  function resetUI() {
    pins = undefined;
    $('.location_tile').remove();
    $("#results_pagination").html("");
    pinIds.forEach(function(p) {
      map.data.remove(map.data.getFeatureById(p));
    });
    pinIds = [];
  }

  //-----------------------------------------------------------------
  function handlePopState(e) {
    var uri = URI(document.URL);
    var data = uri.search(true);

    if (data.lat == undefined || data.lng == undefined) {
      resetUI();
      map.setCenter(MAP_CENTER);
      map.setZoom(18);
      return;
    }

    if (pins) {
      var currentLatLng = pins[0].getGeometry().get();
    }
    if (!pins || Number(data["lat"]) != currentLatLng.lat() || Number(data["lng"]) != currentLatLng.lng()) {
      handleClick(null, data);
    }
  }

  //-----------------------------------------------------------------
  function handlePaginationClick(e) {
    e.preventDefault();
    var pagenum = $(this).text();
    if ($(this).hasClass("disabled")) {return;}
    else if (pagenum-1 == paginationCurrentPage) {return;}
    else if (pagenum == "«") {showThumbnails(paginationCurrentPage - 1);}
    else if (pagenum == "»") {showThumbnails(paginationCurrentPage + 1);}
    else { showThumbnails(pagenum -1);}
  }

  //-----------------------------------------------------------------
  function handleDrawingRectangle(e, point) {
    point = point ? point : e.latLng;
    var bounds = getCurrentTileBounds(point.lat(), point.lng());

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

  //-----------------------------------------------------------------
  // Expose the module's interface to the world (you naughty code, you).
  //-----------------------------------------------------------------
  return {
    initialize: initMap,
    gotoPage: showThumbnails,
    gotoPin: gotoPin,
    getPins:       function() {return pins;},
    getCurrentPin: function() {return lastSelected;},
    getProjection: function() {return map.getProjection();},
    getBounds:     function() {return map.getBounds();},
    hoveredTile:    function() {return hoveredTile;}
  };
}());



// Create the P5 Object.
var p5MapCanvas = new p5(p5Map, 'mini_displays');

/*-----------------------------------------------------------------------------
 Dynamically add stylesheets to the DOM for the tile's colors.
-----------------------------------------------------------------------------*/

var sheet = (function() {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(""));   // WebKit hack :(
  document.head.appendChild(style);
  return style.sheet;
})();


sheet.insertRule(".location_tile.selected { border-color: "+ SELECTED_COLOR +" }",0);
sheet.insertRule(".location_tile.original { border-color: "+ PRIMARY_TILE_COLOR +" }",0);
sheet.insertRule("#results_grid { background-color: "+ AXIS_COLOR +" }",0);