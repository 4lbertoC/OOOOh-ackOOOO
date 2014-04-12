(function() {

	var _carX = 45.474;
	var _carY = 9.186;
	var _map;
	var serverurl = "http://smartcities.herokuapp.com/positions"

	function initialize() {
	    var mapOptions = {
	        center: new google.maps.LatLng(_carX, _carY),
	        zoom: 15
	    };
	    _map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		google.maps.event.addListener(_map, "click", function(event) {
		    var lat = event.latLng.lat();
		    var lng = event.latLng.lng();
		    // populate yor box/field with lat, lng
		    //alert("Lat=" + lat + "; Lng=" + lng);
			$.ajax({
			  type: "POST",
			  url: serverurl,
			  data: '{"lat": "' + lat + '", "lng" : "' + lng + '"}',
			  success: function (data) {
			  	//alert(data);
			  	console.log(data);
			  },
			  contentType: 'json',
			  xhrFields: {
			      withCredentials: false
			  }
			});

		});
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	function onPosition(position) {

	}

	function init() {
		$('.loading').remove();
	}


	init();
})();