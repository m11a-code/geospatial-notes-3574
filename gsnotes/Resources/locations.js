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
			// altitude establishes how high the user is (there is a direct correlation with brownie intake) ;)
			var altitude = e.altitude;
			// how fast is the user traveling?
			var speed = e.speed;
		});
		
		var countdown = null;

		var win = Ti.UI.createWindow({
			title : 'inbox',
			backgroundColor : 'black',
			exitOnClose : false,
			fullscreen : false
		});

		win.addEventListener('android:back', function() {
			win.close();
		});

		var latitudeField = Ti.UI.createLabel({
			color : 'white',
			height : 'auto',
			width: '90%',
			top : '50%',
			borderColor : '#000000',
			borderRadius : 5,
			text : 'Latitude: -',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});

		var longitudeField = Ti.UI.createLabel({
			color : 'white',
			height : 'auto',
			width : '90%',
			top : '56%',
			borderColor : '#000000',
			borderRadius : 5,
			text : 'Longitude: -',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});

		var noteSearchLocationTxtField = Ti.UI.createTextField({
			backgroundColor : '#FFFFFF',
			top : '20%',
			width : '90%',
			height : 'auto',
			borderColor : '#000000',
			borderRadius : 5,
			hintText : 'Enter a location',
			paddingLeft : 10
		});

		var noteField = Titanium.UI.createTextField({
			backgroundColor : '#FFFFFF',
			color : '#336699',
			top : '30%',
			width : '90%',
			height : 'auto',
			borderColor : '#000000',
			borderRadius : 5,
			hintText : 'Type your note',
			clearOnEdit : true,
			paddingLeft : 10
		});

		var saveButton = Ti.UI.createButton({
			title : 'Save note at location',
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
			if(noteSearchLocationTxtField.value !== '') {
				Ti.Geolocation.forwardGeocoder(noteSearchLocationTxtField.value, function(e) {
					latitudeField.text = "Latitude: " + e.latitude;
					longitudeField.text = "Longitude: " + e.longitude;
					
					actInd = Titanium.UI.createActivityIndicator({
				    style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
        			height:30,
        			width:30
    				});
 
    				if (Ti.Platform.osname != 'android')
    				{
        				indWin.add(actInd);
 
				        // message
        				var message = Titanium.UI.createLabel({
            				text:'Storing note; Please wait.',
            				color:'#fff',
            				width:'auto',
            				height:'auto',
            				font:{fontSize:20,fontWeight:'bold'},
            				bottom:20
        				});
        				indWin.add(message);
        				indWin.open();
    				} else {
        				actInd.message = "Saving note...";
    				}
    				actInd.show();
    				
					setTimeout(function() {
						var lat = e.latitude;
						var lon = e.longitude;
						gn.db.saveNote({
							noteName : noteField.value + Math.floor(Math.random() * 1000),
							noteContent : noteField.value,
							noteLatitude : e.latitude,
							noteLongitude : e.longitude,
							noteDateCreated : Math.round((new Date()).getTime() / 1000), //unix timestamp
							noteGroupID : 0 //Only shared with self
						});
						actInd.hide();
    					if (Ti.Platform.osname != 'android') {
        					indWin.close({opacity:0,duration:500});
    					}
						var toast = Titanium.UI.createNotification({
						    duration: Ti.UI.NOTIFICATION_DURATION_LONG,
						    message: "Note stored in inbox."
						});
						toast.show();
					}, 1000 * 3);
					//3 second wait to the spinning indicator window when saving a note.
				});
			}
			else {
				alert('You must provide a location to search!');
			}
		});

		win.add(noteSearchLocationTxtField);
		win.add(latitudeField);
		win.add(longitudeField);
		win.add(noteField);
		win.add(saveButton);
		return win;
	};
})();
