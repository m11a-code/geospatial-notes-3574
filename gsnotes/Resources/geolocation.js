//Create Android Window
(function() {
	gn.ui = gn.ui || {};
	gn.ui.createGeolocationWindow = function() {
		
		
		var win = Titanium.UI.createWindow({
			backgroundColor : '#fff',
			exitOnClose:false,
			fullscreen:false
		});
		
		win.addEventListener('android:back',function(){
			win.close();
		});
		//Create two global variables to store latitude and longitude
		//Since updating the GPS is asynchronous, to use a button to display the position
		//the position has to be stored outside of the function which checks it.  The reason
		//is that you can't force the GPS to update on a button push.
		var globalLongitude;
		var globalLatitude;

		//Create buttons and labels to display to the screen
		var locationButton = Titanium.UI.createButton({
			title : 'Update Location',
			width : 200,
			height : 40,
			top : 0,
			left : 60,
			font : {
				fontSize : 20,
				fontWeight : 'bold'
			},
			textAlign : 'center'
		});

		//If the button is pushed, load the current location data into the window strings and change their color
		locationButton.addEventListener('click', function() {
			updatedLocation.text = 'long:' + globalLongitude;
			updatedLatitude.text = 'lat: ' + globalLatitude;
			updatedLatitude.color = 'red';
			updatedLocation.color = 'red';
		});
		win.add(locationButton);

		var updatedLocationLabel = Titanium.UI.createLabel({
			text : 'Updated Location',
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			textAlign : 'center',
			color : '#111',
			top : 150,
			left : 10,
			height : 15,
			width : 300
		});
		win.add(updatedLocationLabel);

		var updatedLocation = Titanium.UI.createLabel({
			text : 'Updated Location not fired',
			font : {
				fontSize : 11
			},
			textAlign : 'center',
			color : '#444',
			top : 170,
			left : 10,
			height : 15,
			width : 300
		});
		win.add(updatedLocation);

		var updatedLatitude = Titanium.UI.createLabel({
			text : '',
			font : {
				fontSize : 11
			},
			color : '#444',
			top : 190,
			left : 10,
			height : 15,
			width : 300
		});
		win.add(updatedLatitude);

		Ti.Geolocation.preferredProvider = "gps";

		//Error codes
		function translateErrorCode(code) {
			if(code == null) {
				return null;
			}
			switch (code) {
				case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
					return "Location unknown";
				case Ti.Geolocation.ERROR_DENIED:
					return "Access denied";
				case Ti.Geolocation.ERROR_NETWORK:
					return "Network error";
				case Ti.Geolocation.ERROR_HEADING_FAILURE:
					return "Failure to detect heading";
				case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
					return "Region monitoring access denied";
				case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
					return "Region monitoring access failure";
				case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
					return "Region monitoring setup delayed";
			}
		}

		// state vars used by resume/pause
		var locationAdded = false;

		//
		//  Show alert is geolocation is turned off
		//
		if(Titanium.Geolocation.locationServicesEnabled === false) {
			Titanium.UI.createAlertDialog({
				title : 'Geolocation',
				message : 'Your device has geo turned off - turn it on.'
			}).show();
		} else {
			if(Titanium.Platform.name != 'android') {
				var authorization = Titanium.Geolocation.locationServicesAuthorization;
				Ti.API.info('Authorization: ' + authorization);
				if(authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
					Ti.UI.createAlertDialog({
						title : 'Geolocation',
						message : 'You have disallowed Titanium from running geolocation services.'
					}).show();
				} else if(authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
					Ti.UI.createAlertDialog({
						title : 'Geolocation',
						message : 'Your system has disallowed Titanium from running geolocation services.'
					}).show();
				}
			}
			/*
			//
			// IF WE HAVE COMPASS GET THE HEADING
			//
			if (Titanium.Geolocation.hasCompass)
			{
			//
			//  TURN OFF ANNOYING COMPASS INTERFERENCE MESSAGE
			//
			Titanium.Geolocation.showCalibration = false;

			//
			// SET THE HEADING FILTER (THIS IS IN DEGREES OF ANGLE CHANGE)
			// EVENT WON'T FIRE UNLESS ANGLE CHANGE EXCEEDS THIS VALUE
			Titanium.Geolocation.headingFilter = 90;

			//
			//  GET CURRENT HEADING - THIS FIRES ONCE
			//
			Ti.Geolocation.getCurrentHeading(function(e)
			{
			if (e.error)
			{
			currentHeading.text = 'error: ' + e.error;
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			return;
			}
			var x = e.heading.x;
			var y = e.heading.y;
			var z = e.heading.z;
			var magneticHeading = e.heading.magneticHeading;
			var accuracy = e.heading.accuracy;
			var trueHeading = e.heading.trueHeading;
			var timestamp = e.heading.timestamp;

			currentHeading.text = 'x:' + x + ' y: ' + y + ' z:' + z;
			Titanium.API.info('geo - current heading: ' + new Date(timestamp) + ' x ' + x + ' y ' + y + ' z ' + z);
			});

			//
			// EVENT LISTENER FOR COMPASS EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON HEADING FILTER)
			//
			var headingCallback = function(e)
			{
			if (e.error)
			{
			updatedHeading.text = 'error: ' + e.error;
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			return;
			}

			var x = e.heading.x;
			var y = e.heading.y;
			var z = e.heading.z;
			var magneticHeading = e.heading.magneticHeading;
			var accuracy = e.heading.accuracy;
			var trueHeading = e.heading.trueHeading;
			var timestamp = e.heading.timestamp;

			updatedHeading.text = 'x:' + x + ' y: ' + y + ' z:' + z;
			updatedHeadingTime.text = 'timestamp:' + new Date(timestamp);
			updatedHeading.color = 'red';
			updatedHeadingTime.color = 'red';
			setTimeout(function()
			{
			updatedHeading.color = '#444';
			updatedHeadingTime.color = '#444';

			},100);

			Titanium.API.info('geo - heading updated: ' + new Date(timestamp) + ' x ' + x + ' y ' + y + ' z ' + z);
			};
			Titanium.Geolocation.addEventListener('heading', headingCallback);
			headingAdded = true;
			}
			else
			{
			Titanium.API.info("No Compass on device");
			currentHeading.text = 'No compass available';
			updatedHeading.text = 'No compass available';
			}
			*/

			//Set the accuracy to the highest setting
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

			//  Supposedly detects if the device moves and updates based on that, this doesn't work on the device
			//  I have.
			Titanium.Geolocation.distanceFilter = 10;

			// Event listener for Geolocation events
			var locationCallback = function(e) {
				if(!e.success || e.error) {
					updatedLocation.text = 'error:' + JSON.stringify(e.error);
					updatedLatitude.text = '';
					Ti.API.info("Code translation: " + translateErrorCode(e.code));
					return;
				}

				//store the coordinates of e in the global longitude and latitude
				globalLongitude = e.coords.longitude;
				globalLatitude = e.coords.latitude;

				setTimeout(function() {
					updatedLatitude.color = '#444';
					updatedLocation.color = '#444';
				}, 100);
			};

			Titanium.Geolocation.addEventListener('location', locationCallback);
			locationAdded = true;
		}

		if(Titanium.Platform.name == 'android') {
			//  as the destroy handler will remove the listener, only set the pause handler to remove if you need battery savings
			Ti.Android.currentActivity.addEventListener('pause', function(e) {
				Ti.API.info("pause event received");
				if(locationAdded) {
					Ti.API.info("removing location callback on pause");
					Titanium.Geolocation.removeEventListener('location', locationCallback);
					locationAdded = false;
				}
			});
			Ti.Android.currentActivity.addEventListener('destroy', function(e) {
				Ti.API.info("destroy event received");
				if(locationAdded) {
					Ti.API.info("removing location callback on destroy");
					Titanium.Geolocation.removeEventListener('location', locationCallback);
					locationAdded = false;
				}
			});
			Ti.Android.currentActivity.addEventListener('resume', function(e) {
				Ti.API.info("resume event received");
				if(!locationAdded) {
					Ti.API.info("adding location callback on resume");
					Titanium.Geolocation.addEventListener('location', locationCallback);
					locationAdded = true;
				}
			});
		}

		//open the window
		return win;
	};
})();
