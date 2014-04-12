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
		_video = document.getElementById('video');

	function initializeGoogleMaps() {
	    var mapOptions = {
	        center: _position,
	        zoom: 15
	    };
	    _map = new google.maps.Map(_mapCanvas, mapOptions);

	    _marker = new google.maps.Marker({
	    	position: _position,
	    	map: _map
	    });
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
		}
	}

	function init() {
		_position = new google.maps.LatLng(_carX, _carY);
		google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
		
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


	init();
})();