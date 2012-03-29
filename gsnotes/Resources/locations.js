(function() {
	gn.ui = gn.ui || {};
	gn.ui.createLocationWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'inbox',
			backgroundColor : 'blue',
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
					var newLong = longitudeField.value
					if(newlat / lat <= 0.1 || (newlat / lat > 1 && newlat / lat <= 1.1)) {
						clearInterval(this);
						if(newlong / lon <= 0.1 || (newLong / lon > 1 && newlong / lon <= 1.1)) {
							var data = getNotes({
								mode : 'nearby',
								params : {
									longitude : lon,
									latitude : lat
								}
							});
							var n = Ti.UI.createNotification({
								message : "Geocoded reminder: " + data[0].noteContent
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
					}
				}, 1000 * 60 * 5);
				// 5 minute interval check
			}, 1000 * 60);
			//60 second wait to set the notification timer
		});
		var recordButton = Ti.UI.createButton({
			title : 'Record note',
			height : 60,
			width : '40%',
			left : '10%',
			bottom : 70,
			isRecording : false
		});

		var playButton = Ti.UI.createButton({
			title : 'Play note',
			height : 60,
			width : '40%',
			right : '10%',
			bottom : 70
		});

		recordButton.addEventListener('click', function() {
			alert('Broken, will fix next build cycle');
			var countdown = 5;

			/*Ti.App.fireEvent('recorder:recordNote', {
			 latitude : latitudeField.value,
			 longitude : longitudeField.value,
			 friend : ''
			 });
			 this.isRecording = !this.isRecording;
			 this.title = (this.isRecording ? 'Record note' : 'Stop recording');*/
		});

		playButton.addEventListener('click', function() {
			alert('Broken, will fix next build cycle');
			var AppIntent = Ti.Android.createIntent({
				flags : Ti.Android.FLAG_ACTIVITY_CLEAR_TOP | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP,
				className : 'org.appcelerator.titanium.TiActivity',
				packageName : Ti.App.id
			});
			AppIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

			var NotificationClickAction = Ti.Android.createPendingIntent({
				activity : Ti.Android.currentActivity,
				intent : AppIntent,
				flags : Ti.Android.FLAG_UPDATE_CURRENT,
				type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY
			});

			var notification = Ti.Android.createNotification({
				icon : 0x7f020000,
				contentIntent : NotificationClickAction,
				contentTitle : 'Notification',
				contentText : "You tried to play a note.  Try again next build cycle!",
				tickerText : "You tried to play a note.  Try again next build cycle!"
			});

			Ti.Android.NotificationManager.notify(1, notification);

			/*Ti.App.fireEvent('recorder:stopRecording');
			 Ti.App.fireEvent('recorder:playNote', {
			 latitude : latitudeField.value,
			 longitude : longitudeField.value,
			 friend : ''
			 });*/
		});
		win.add(latitudeField);
		win.add(noteField);
		win.add(longitudeField);
		win.add(saveButton);
		win.add(playButton);
		win.add(recordButton);
		return win;
	};
})();
