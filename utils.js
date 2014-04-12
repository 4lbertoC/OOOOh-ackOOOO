(function(window) {

	var POLL_INTERVAL = 1000,
		CAR_POSITION_REQUEST = "http://smartcities.herokuapp.com/positions";

	if('AudiHack' in window) {
		return;
	}

	window.AudiHack = {

		getPosition: function(onPosition) {
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

	};

})(window)
