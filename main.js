(function() {

	var _map;
	var _carX = 45.474;
	var _carY = 9.186;
	var _position = new google.maps.LatLng(_carX, _carY);

	function initialize() {
	    var mapOptions = {
	        center: _position,
	        zoom: 15
	    };
	    _map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		google.maps.event.addListener(_map, "click", function(event) {
		    var lat = event.latLng.lat();
		    var lng = event.latLng.lng();
		    // populate yor box/field with lat, lng
		    alert("Lat=" + lat + "; Lng=" + lng);
		});
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	function onPosition(position) {

	}

	function init() {
		$('.loading').remove();

		setInterval(function() {
			_carX += 0.005;
			// _position.setPosition(_carX, _carY);
			_map.setOptions({
				center: new google.maps.LatLng(_carX, _carY)
			})
		}, 1000);
	}


	init();
})();