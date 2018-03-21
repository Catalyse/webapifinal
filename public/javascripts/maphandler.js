//Map functions===================================================================================================
function InitMap(start, end) {
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 39.7645, lng: -104.9955}
  });
  directionsDisplay.setMap(map);

  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}

var map;
var markerList = [];

function InitMapBlank() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {  
      var feed = JSON.parse(this.responseText);
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: {lat: 39.7645, lng: -104.9955}
      });
      MarkBusLocations(map, feed);
    }
  }
  xhttp.open("GET", "/getmapdata", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function UpdateBusses() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {  
      var feed = JSON.parse(this.responseText);
      MarkBusLocations(map, feed);
    }
  }
  xhttp.open("GET", "/getmapdata", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function GeoCodeAddress(addressText) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      map.setZoom(15);
    } 
    else {
      alert('Geocode was not successful for the following reason: ' + status);
      map.setZoom(10);
    }
  });
}  

function MarkBusLocations(map, feed) {
  var locations = [];
  var tempMarkerList = [];

  for(i = 0; i < feed.entity.length; i++) {
    locations.push(["Bus #" + feed.entity[i].id.split('_')[1], feed.entity[i].vehicle.position.latitude, feed.entity[i].vehicle.position.longitude])
  }

  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  for (i = 0; i < locations.length; i++) {  
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });
    tempMarkerList.push(marker);

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }

  DeleteMarkers();
  markerList = tempMarkerList;
}

function DeleteMarkers() {
  //Loop through all the markers and remove
  for (var i = 0; i < markerList.length; i++) {
      markerList[i].setMap(null);
  }
  markerList = [];
};