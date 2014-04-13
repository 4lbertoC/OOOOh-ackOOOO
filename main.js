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
	    	icon: 'images/car.png'
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

	function onSearch(searchText) {
		alert("Searching for " + searchText);
		var latLng = new google.maps.LatLng(_carX, _carY);
	  	var end = searchText;
	  	var request = {
	    	origin:latLng,
	    	destination:end,
	    	travelMode: google.maps.TravelMode.DRIVING
	  	};
	  	_directionsService.route(request, function(result, status) {
	    	if (status == google.maps.DirectionsStatus.OK) {
	    		alert("Rullo di tamburi...");
	      		_directionsDisplay.setDirections(result);
	      		showSteps(result);
	    	}
	  	});
	}

	function updateMarkers(results, status) {
	  	
	// 		for (var i = 0; i < _markers.length; i++) {
    // 			_markers[i].setMap(null);
  	//  	}
  	//  	_markers = [];

	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    	for (var i = 0; i < results.length; i++) {
			  	createMarker(results[i].geometry.location);
    		}
	  	}
	}


	function showSteps(directionResult) {
	  	// For each step, place a marker, and add the text to the marker's
	  	// info window. Also attach the marker to an array so we
	  	// can keep track of it and remove it when calculating new
	  	// routes.
		var myRoute = directionResult.routes[0].legs[0];

	  	for (var i = 0; i < myRoute.steps.length; i++) {
	  		createMarker(myRoute.steps[i].start_location);
	  	}
	}

	function createMarker(location) {
		var marker = new google.maps.Marker({
	    	map: _map,
	    	position: location,
	    	icon: 'images/pin-elettrico-48.png'
	  	});
	  	_markers.push(marker);
	  	//attachInstructionText(marker, myRoute.steps[i].instructions);
	}

	function init() {
		// $('.loading').remove();
		// $(_mapCanvas).css("visibility", "visible");

		$('.menu-button').click(function() {
			$('body').toggleClass('show-menu');
			$('#hamburger').toggle();
			$('#menu-close').toggle();
			$('#search-text-container').toggle();
			$('#search-button').toggle();
		})

		$('#menu-one').click(function() {
			alert('Ohai');
		});

		$('#search-text').on('keypress', function(event) {
			if(event.originalEvent && event.originalEvent.keyCode === 13)  {
				search();
			}
		});

		$('#search-button').click(search);

		_position = new google.maps.LatLng(_carX, _carY);
		google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
		
		$(_video).css("top",((window.innerHeight - $(_video).height()) / 2) + "px");
		$(_video).click(function() {
			_video.play();
		});
		$(_video).on('ended', function() {
			setInterval(function() {
				AudiHack.getPosition(onPosition);
			}, POLL_INTERVAL);
		});
		_video.play();

	}

	function search() {
		onSearch($('#search-text').val());
	}

	init();
})();