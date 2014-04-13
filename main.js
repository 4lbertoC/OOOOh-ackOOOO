(function() {

	var POLL_INTERVAL = 1000,
		CAR_POSITION_REQUEST = "http://smartcities.herokuapp.com/positions";

	var _map,
		_mapOptions = {
	        center: _position,
	        zoom: 15,
	    	disableDefaultUI: true
	    },
		_marker,
		_mapCanvas = document.getElementById("map-canvas"),
		_carX = 45.474,
		_carY = 9.186,
		_car,
		_position,
		_video = document.getElementById('video'),
		_service,
		_markers = [],
		_nearby_markers = [],
		_waypts = [],
		_directionsService,
		_directionsDisplay,
		_stepDisplay,
		_lastSearch = '',
		_currentMarkerX,
		_currentMarkerY;

	function initializeGoogleMaps() {
	    _map = new google.maps.Map(_mapCanvas, _mapOptions);

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

	   	// Instantiate an info window to hold step text.
  		_stepDisplay = new google.maps.InfoWindow();
	}

	function onPosition(position, force) {
		if((force !== 'success' && force) || (+position.lng !== _carY || +position.lat !== _carX)) {
			$('.loading').fadeOut(1000, function() {
					$('.loading').remove();
				});
			$(_mapCanvas).css("visibility", "visible");
			_carX = +position.lat;
			_carY = +position.lng;
			var latLng = _position = new google.maps.LatLng(_carX, _carY);
			_marker.setPosition(latLng);
			_map.setOptions({
				center: latLng
			});

			var request = {
			    location: latLng,
			    radius: '1000',
			    types: ['store']
			};
		  	_service.nearbySearch(request, updateMarkers);
		}
	}

	function onSearch(searchText) {
		//alert("Searching for " + searchText);
		var latLng = _position = new google.maps.LatLng(_carX, _carY);
	  	var end = searchText;
	  	var request = {
	    	origin:latLng,
	    	destination:end,
	    	waypoints: _waypts,
      		optimizeWaypoints: true,
	    	travelMode: google.maps.TravelMode.DRIVING
	  	};
	  	_directionsService.route(request, function(result, status) {
	    	if (status == google.maps.DirectionsStatus.OK) {
	    		//alert("Rullo di tamburi...");
	      		_directionsDisplay.setDirections(result);
	      		showSteps(result);
	    	}
	  	});

	  	// reset waypts 
	  	_waypts = [];
	}

	function updateMarkers(results, status) {
	  	
		for (var i = 0; i < _nearby_markers.length; i++) {
    		_nearby_markers[i].setMap(null);
  	 	}
  	 	_nearby_markers = [];

	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    	for (var i = 0; i < results.length; i++) {
			  	createNearbyMarker(results[i].geometry.location);
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
		$('#linguetta').show();
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

	function createNearbyMarker(location) {
		var marker = new google.maps.Marker({
	    	map: _map,
	    	position: location,
	    	icon: 'images/pin-elettrico-48.png'
	  	});
	  	_nearby_markers.push(marker);
	  	//attachInstructionText(marker, myRoute.steps[i].instructions);
	  	attachInfo(marker);
	}

	function generatePopupText(distance, duration) {
		return '<div class="popup"><img src="images/elettrica-64.png" class="popup-0">' +
			'<div class="popup-1">' + distance + '<br/>' + duration + '</div>' +
			'<div class="popup-2"><span class="fa fa-angle-right"></div></div>';
	}

	function attachInfo(marker) {
		
	  	google.maps.event.addListener(marker, 'click', function() {

	  		var latLng = _position = new google.maps.LatLng(_carX, _carY);
		  	var end = marker.position;
		  	var request = {
		    	origin:latLng,
		    	destination:end,
		    	waypoints: _waypts,
	      		optimizeWaypoints: true,
		    	travelMode: google.maps.TravelMode.DRIVING
		  	};
		  	_directionsService.route(request, function(result, status) {
		    	if (status == google.maps.DirectionsStatus.OK) {
		    		//alert("Rullo di tamburi...");
		      		var text = generatePopupText(result.routes[0].legs[0].distance.text, result.routes[0].legs[0].duration.text);

		 			_stepDisplay.setContent(text);
			    	_stepDisplay.open(_map, marker);
			    	_currentMarkerX = marker.getPosition().lat();
			    	_currentMarkerY = marker.getPosition().lng();
		      		$('.popup-2').click(showRightPanel);
		    	}
		  	});
	  	});
	}

	function showRightPanel() {
		$('body').addClass('show-right-panel');
	}

	function init() {
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
		$('#center-button').click(center);
		$('#linguetta').click(toggleDirections);
		$('#reset-query').click(restart);
		$('#navigation').click(navigate);
		$('#right-menu-button-container').click(function() {
			$('body').removeClass('show-right-panel');
		});
		$('.mock-pin-info').click(function() {
			navigateTo(_currentMarkerX, _currentMarkerY);
		});
		$('.direction-info-hide-button').click(function() {
			$('#direction-info').toggleClass('hide-me');
		});
		$('.mock-direction-info').click(navigate);
		$('.car-option').click(function() {
			$('.car-selection').remove();
		});

		_position = new google.maps.LatLng(_carX, _carY);
		google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
		
		startWithVideo();
		// startWithoutVideo();

	}

	function toggleDirections() {
		$('body').toggleClass('show-directions');
	}

	function navigate() {
		window.open('http://www.google.com/maps/dir/' + _carX + ',' + _carY + '/' + _lastSearch);
	}

	function navigateTo(x, y) {
		window.open('http://www.google.com/maps/dir/' + _carX + ',' + _carY + '/' + x + ',' + y);
	}

	function search() {
		_lastSearch = $('#search-text').val();
		_directionsDisplay.setMap(_map);
		onSearch(_lastSearch);
		$('#reset-query').show();
		$('body').addClass('show-direction-info');
		$('#search-text').blur();
	}

	function startWithVideo() {
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

	function startWithoutVideo() {
		$('.loading').remove();
		$(_mapCanvas).css("visibility", "visible");
		setInterval(function() {
			AudiHack.getPosition(onPosition);
		}, POLL_INTERVAL);
	}

	function restart() {
		$.each(_markers, function(i) { _markers[i].setMap(null) });
		_directionsDisplay.setMap(null);
	  	_directionsDisplay = new google.maps.DirectionsRenderer();
	   	_directionsDisplay.setMap(_map);
	   	_directionsDisplay.setPanel(document.getElementById("directionsPanel"));
		$('#linguetta').hide();
		$('#reset-query').hide();
		$('body').removeClass('show-directions');
		$('body').removeClass('show-direction-info');
		$('#direction-info').removeClass('hide-me');
		$('#search-text').val('');
		_lastSearch = '';
		_map.setOptions({
			center: _position,
			zoom: 15
		});
		AudiHack.getPosition(onPosition, true);
	}

	function center() {
		_map.setOptions({
			center: _position,
			zoom: 15
		});
	}

	init();
})();