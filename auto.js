(function() {

	var _carX = 45.474;
	var _carY = 9.186;
	var _map;
	var _mapCanvas = document.getElementById("map-canvas");
	var _marker;
	var _position;
	var serverurl = "http://smartcities.herokuapp.com/positions"

	function onPosition(data) {
		var latLng = new google.maps.LatLng(data.lat, data.lng);
		_marker.setPosition(latLng);
		_map.setOptions({
			center: latLng
		});
	}

	function initialize() {
		var _position = new google.maps.LatLng(_carX, _carY);
	    var mapOptions = {
	        center: _position,
	        zoom: 15
	    };
	    _map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	    _marker = new google.maps.Marker({
	    	position: _position,
	    	map: _map,
	    	icon: 'car.png'
	    });

		google.maps.event.addListener(_map, "click", function(event) {
		    var lat = event.latLng.lat();
		    var lng = event.latLng.lng();
			$.ajax({
			  type: "POST",
			  url: serverurl,
			  data: '{"lat": "' + lat + '", "lng" : "' + lng + '"}',
			  success: onPosition,
			  contentType: 'json',
			  xhrFields: {
			      withCredentials: false
			  }
			});

		});
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	function init() {
		$(_mapCanvas).css("visibility", "visible");
		$('.loading').remove();

		AudiHack.getPosition(onPosition);
	}

	init();
})();