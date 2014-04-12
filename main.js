(function() {

	var POLL_INTERVAL = 1000,
		CAR_POSITION_REQUEST = "http://smartcities.herokuapp.com/positions";

	var _map,
		_marker,
		_mapCanvas = document.getElementById("map-canvas"),
		_carX = 45.474,
		_carY = 9.186,
		_car,
		_position,
		_video = document.getElementById('video'),
		_service,
		_markers = [],
		_directionsService,
		_directionsDisplay;

	function initializeGoogleMaps() {
	    var mapOptions = {
	        center: _position,
	        zoom: 15,
	    	disableDefaultUI: true
	    };
	    _map = new google.maps.Map(_mapCanvas, mapOptions);

	    _marker = new google.maps.Marker({
	    	position: _position,
	    	map: _map,
	    	icon: 'car.png'
	    });

	   	_service = new google.maps.places.PlacesService(_map);
		
		_directionsService = new google.maps.DirectionsService();

	   	_directionsDisplay = new google.maps.DirectionsRenderer();
	   	_directionsDisplay.setMap(_map);
	   	_directionsDisplay.setPanel(document.getElementById("directionsPanel"));
	}

	function onPosition(position) {
		if(+position.lng !== _carY || +position.lat !== _carX) {
			$('.loading').remove();
			$(_mapCanvas).css("visibility", "visible");
			_carX = +position.lat;
			_carY = +position.lng;
			var latLng = new google.maps.LatLng(_carX, _carY);
			_marker.setPosition(latLng);
			_map.setOptions({
				center: latLng
			});

			var request = {
			    location: latLng,
			    radius: '500',
			    types: ['store']
			};
		  	_service.nearbySearch(request, updateMarkers);
		}
	}

	function updateMarkers(results, status) {
	  	for (var i = 0; i < _markers.length; i++) {
    		_markers[i].setMap(null);
  	  	}
  	  	_markers = [];
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    	for (var i = 0; i < results.length; i++) {
	      		var place = results[i];
	      		createMarker(results[i]);
    		}
	  	}
	}

	function createMarker(place) {
	  	var placeLoc = place.geometry.location;
	  	var marker = new google.maps.Marker({
	    	map: _map,
	    	position: place.geometry.location
	  	});
	  	_markers.push(marker);
	}

	function calcRoute() {
		//var start = document.getElementById("start").value;
		var latLng = new google.maps.LatLng(_carX, _carY);
	  	var end = $("#where").val();
	  	var request = {
	    	origin:latLng,
	    	destination:end,
	    	travelMode: google.maps.TravelMode.DRIVING
	  	};
	  	_directionsService.route(request, function(result, status) {
	    	if (status == google.maps.DirectionsStatus.OK) {
	      		_directionsDisplay.setDirections(result);
	    	}
	  	});
	}

	function init() {
		_position = new google.maps.LatLng(_carX, _carY);
		google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
		
		// $(_video).click(function() {
		// 	_video.play();
		// });
		// $(_video).on('ended', function() {
			setInterval(function() {
				AudiHack.getPosition(onPosition);
			}, POLL_INTERVAL);

		// });
		// _video.play();

		// $('.loading').remove();
		// $(_mapCanvas).css("visibility", "visible");
	}


	init();
	
	$("#search-icon").click(calcRoute);
})();