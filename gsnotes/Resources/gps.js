(function() {
	// create a basic window so we can show information to the user in a label
	gn.ui.createGPSWindow = function() {

		var win = Ti.UI.createWindow({
			backgroundColor : '#fff',
			exitOnClose : false,
			fullscreen : false
		});

		win.addEventListener('android:back', function() {
			win.close();
		});

		var label = Ti.UI.createLabel({
			color : '#900'
		});
		// This color comes to you courtesy of Kramerican!
		win.add(label);
		win.open();

		// now set up the geolocation code
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 0;

		/**
		 * This function is called by the phone every time we have new geolocation data. It writes out where the user currently is.
		 * @param e An argument given to us by the phone with information such as accuracy, latitude, and longitude.
		 */
		function reportPosition(e) {
			if(!e.success || e.error) {
				label.text = 'error: ' + JSON.stringify(e.error);
			} else {
				Ti.App.fireEvent('positionUpdate', e.coords);
				// accuracy is the error margin for the user's location
				var accuracy = e.coords.accuracy;
				// timestamp is when the user's location was last updated
				var timestamp = e.coords.timestamp;
				// latitude and longitude establish a point on the map
				var latitude = e.coords.latitude;
				var longitude = e.coords.longitude;
				// altitude establishes how high the user is (there is a direct correlation with brownie intake)
				var altitude = e.coords.altitude;
				// how fast is the user traveling?
				var speed = e.coords.speed;

				// now we'll show some of this data to the user in the app
				label.text = 'Last updated: ' + new Date(timestamp) + ', accuracy: ' + accuracy + ', latitude: ' + latitude + ', longitude: ' + longitude;
			}
		}

		// This will get the location right now, and will get the phone ready to listen for the user's current location.
		Ti.Geolocation.getCurrentPosition(reportPosition);
		// And this fires whenever the "distance filter" is surpassed -- with a filter of 0, this happens all the time
		Ti.Geolocation.addEventListener('location', reportPosition);
		return win;
	};
})();
