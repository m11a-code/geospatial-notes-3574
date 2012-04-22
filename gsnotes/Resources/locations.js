(function() {
	gn.ui = gn.ui || {};
	gn.ui.createLocationWindow = function() {
		Ti.App.addEventListener('positionUpdate', function(e) {
			saveButton.title = "Save location (enabled)";
			// accuracy is the error margin for the user's location
			latitudeField.value = e.latitude;
			longitudeField.value = e.longitude;
			var accuracy = e.accuracy;
			// timestamp is when the user's location was last updated
			var timestamp = e.timestamp;
			// latitude and longitude establish a point on the map
			var latitude = e.latitude;
			var longitude = e.longitude;
			// altitude establishes how high the user is (there is a direct correlation with brownie intake)
			var altitude = e.altitude;
			// how fast is the user traveling?
			var speed = e.speed;
		});

		var win = Ti.UI.createWindow({
			title : 'inbox',
			backgroundColor : 'black',
			exitOnClose : false,
			fullscreen : false
		});

		win.addEventListener('android:back', function() {
			win.close();
		});

		var latitudeField = Titanium.UI.createTextField({
			color : '#336699',
			height : 55,
			bottom : 260,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			clearOnEdit : true,
			hintText : 'Latitude',
			width : 250
		});

		var longitudeField = Titanium.UI.createTextField({
			color : '#336699',
			height : 55,
			bottom : 210,
			width : 250,
			hintText : 'Longitude',
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			clearOnEdit : true,
		});

		Ti.App.addEventListener('app:geoLocationUpdate', function(longLat) {
			latitudeField.value = longLat.lat;
			longitudeField.value = longLat.lon;
		});

		var noteField = Titanium.UI.createTextField({
			color : '#336699',
			height : 55,
			bottom : 315,
			width : 250,
			hintText : 'Type your note',
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			clearOnEdit : true,
		});

		var saveButton = Ti.UI.createButton({
			title : 'Save Location',
			height : 60,
			width : '90%',
			bottom : 130
		});

		var recButton = Ti.UI.createButton({
			title : 'Record audio note',
			height : 60,
			width : '90%',
			bottom : 60
		});

		recButton.addEventListener('click', function() {
			Ti.App.fireEvent('recorder:recordNote', {
				latitude : 0,
				longitude : 0,
				friend : 'Anthony'
			});
		});
		win.add(recButton);

		saveButton.addEventListener('click', function() {
			Ti.App.Properties.setString(latitudeField.value, noteField.value);
			Ti.App.Properties.setString(longitudeField.value, noteField.value);
			setTimeout(function() {
				var lat = latitudeField.value;
				var lon = longitudeField.value;
				gn.db.saveNote({
					noteName : noteField.value + Math.floor(Math.random() * 1000),
					noteContent : noteField.value,
					noteLatitude : latitudeField.value,
					noteLongitude : longitudeField.value,
					noteDateCreated : Math.round((new Date()).getTime() / 1000), //unix timestamp
					noteGroupID : 0 //Only shared with self
				});

				setInterval(function() {
					var newlat = latitudeField.value;
					var newLong = longitudeField.value;
					if(newlong / (lon * 1) <= 0.1 || (newLong / (lon * 1) > 1 && newlong / (lon * 1) <= 1.1)) {
						clearInterval(this);
						var data = getNotes({
							mode : 'nearby',
							params : {
								longitude : lon,
								latitude : lat
							}
						});
						var msg = 'Something went wrong -- no notes found, but there should have been one?';
						if(data[0] && data[0].noteContent) {
							msg = data[0].noteContent;
						}
						var n = Ti.UI.createNotification({
							message : "Geocoded reminder: " + msg
						});

						// Set the duration to either Ti.UI.NOTIFICATION_DURATION_LONG or NOTIFICATION_DURATION_SHORT
						n.duration = Ti.UI.NOTIFICATION_DURATION_LONG;

						// Setup the X & Y Offsets
						n.offsetX = 100;
						n.offsetY = 75;

						// Make it a little bit interesting
						var countdownSeconds = setInterval(function() {
							countdown = countdown - 1;
							if(countdown < 0) {
								clearInterval(countdownSeconds);
								n.show();
							}
						}, 1000);
					} else {
						clearInterval(this);
						var msg = noteField.value;
						var n = Ti.UI.createNotification({
							message : "Geocoded reminder: " + msg
						});

						// Set the duration to either Ti.UI.NOTIFICATION_DURATION_LONG or NOTIFICATION_DURATION_SHORT
						n.duration = Ti.UI.NOTIFICATION_DURATION_LONG;

						// Setup the X & Y Offsets
						n.offsetX = 100;
						n.offsetY = 75;

						// Make it a little bit interesting
						var countdownSeconds = setInterval(function() {
							countdown = countdown - 1;
							if(countdown < 0) {
								clearInterval(countdownSeconds);
								n.show();
							}
						}, 1000);
					}
				}, 1000 * 30);
				// 30 second check time
			}, 1000 * 30);
			//30 second wait to set the notification timer
		});

		win.add(latitudeField);
		win.add(longitudeField);
		win.add(noteField);
		win.add(saveButton);
		return win;
	};
})();
