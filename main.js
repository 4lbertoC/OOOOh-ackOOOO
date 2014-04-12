(function() {

	var POLL_INTERVAL = 1000,
		CAR_POSITION_REQUEST = "http://smartcities.herokuapp.com/positions";

	var _map,
		_mapCanvas = document.getElementById("map-canvas"),
		_carX = 45.474,
		_carY = 9.186,
		_car,
		_position;

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

		google.maps.event.addListener(_map, "click", function(event) {
		    var lat = event.latLng.lat();
		    var lng = event.latLng.lng();
		    // populate yor box/field with lat, lng
		    alert("Lat=" + lat + "; Lng=" + lng);
		});
	}

	function onPosition(position) {
		if(+position.lng !== _carY || +position.lat !== _carX) {
			_carX = +position.lat;
			_carY = +position.lng;
			var latLng = new google.maps.LatLng(_carX, _carY);
			_marker.setPosition(latLng);
			_map.setOptions({
				center: latLng
			});
		}
	}

	function requestPosition() {
		$.ajax({
			url: CAR_POSITION_REQUEST,
			type: 'GET',
			success: onPosition,
			contentType: 'json',
			xhrFields: {
			    withCredentials: false
			}
		})
	}

	function init() {
		_position = new google.maps.LatLng(_carX, _carY);
		google.maps.event.addDomListener(window, 'load', initializeGoogleMaps);
		$('.loading').remove();

		setInterval(function() {
			requestPosition();
			// _carX += 0.005;
			// // _position.setPosition(_carX, _carY);
			// _map.setOptions({
			// 	center: new google.maps.LatLng(_carX, _carY)
			// })
		}, POLL_INTERVAL);
	}


	init();
})();