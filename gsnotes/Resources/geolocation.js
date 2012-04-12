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
			this.close();
		});
		//Create two global variables to store latitude and longitude
		//Since updating the GPS is asynchronous, to use a button to display the position
		//the position has to be stored outside of the function which checks it.  The reason
		//is that you can't force the GPS to update on a button push.
		var globalLongitude;
		var globalLatitude;

		//Create buttons and labels to display to the screen
		// var locationButton = Titanium.UI.createButton({
			// title : 'Update Location',
			// width : 200,
			// height : 40,
			// top : 0,
			// left : 60,
			// font : {
				// fontSize : 20,
				// fontWeight : 'bold'
			// },
			// textAlign : 'center'
		// });

		//If the button is pushed, load the current location data into the window strings and change their color
		// locationButton.addEventListener('click', function() {
			// updatedLocation.text = 'long:' + globalLongitude;
			// updatedLatitude.text = 'lat: ' + globalLatitude;
			// updatedLatitude.color = 'red';
			// updatedLocation.color = 'red';
		// });
		// win.add(locationButton);

		// var updatedLocationLabel = Titanium.UI.createLabel({
			// text : 'Updated Location',
			// font : {
				// fontSize : 12,
				// fontWeight : 'bold'
			// },
			// textAlign : 'center',
			// color : '#111',
			// top : 150,
			// left : 10,
			// height : 15,
			// width : 300
		// });
		// win.add(updatedLocationLabel);
// 
		// var updatedLocation = Titanium.UI.createLabel({
			// text : 'Updated Location not fired',
			// font : {
				// fontSize : 11
			// },
			// textAlign : 'center',
			// color : '#444',
			// top : 170,
			// left : 10,
			// height : 15,
			// width : 300
		// });
		// win.add(updatedLocation);
// 
		// var updatedLatitude = Titanium.UI.createLabel({
			// text : '',
			// font : {
				// fontSize : 11
			// },
			// color : '#444',
			// top : 190,
			// left : 10,
			// height : 15,
			// width : 300
		// });
		// win.add(updatedLatitude);

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
				message : 'Your device has geo turned off - turn it on please.'
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
		
		
		
		
		////////////////
		//BEGIN MapView Matthew Ibarra created since most/all of what I said I would do this build cycle was already completed
		////////////////
		
		//create the window
		var win1 = Titanium.UI.createWindow({  
		    title:'MapView',
		    backgroundColor: '#000',
		    exitOnClose:false,
			fullscreen:false
		});
		win1.addEventListener('android:back', function() {
			win1.close();
		});
		
		//create our mapview
		var mapview = Titanium.Map.createView({
			height: '100%',
			mapType: Titanium.Map.STANDARD_TYPE,
			region:{latitude: 51.50015, longitude:-0.12623, latitudeDelta:0.02, longitudeDelta:0.02},
			animate: true,
			regionFit: true,
			userLocation: true
		});
		
		//set the distance filter
		Ti.Geolocation.distanceFilter = 10;
		
		//This is required by Apple so it can inform the user of why you are accessing their location data
		Ti.Geolocation.purpose = "To obtain current user location for use of finding nearby notes to current user location.";
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				//if mapping location doesn't work, show an alert
				//if(Titanium.Geolocation.locationServicesEnabled === false) {
				Titanium.UI.createAlertDialog({
				title : 'Geolocation',
				message : 'Your device has geo turned off - turn it on please.',
				buttonNames: ['OK']
				}).show();
				//}
				//alert('Sorry, but it seems that geolocation is not available on your device right now!');
				//return;
			}
			//get properties from Ti.Geolocation
			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;
			var altitude = e.coords.altitude;
			var heading = e.coords.heading;
			var accuracy = e.coords.accuracy;
			var speed = e.coords.speed;
			var timestamp = e.coords.timestamp;
			var altitudeAccuracy = e.coords.altitudeAccuracy;
			//Now, apply the longitude and latitude properties to our mapview
			mapview.region = {latitude: latitude, longitude: longitude, latitudeDelta:0.02, longitudeDelta:0.02};
			mapview.setLocation(mapview.region);
		});
		
		//will eventually only have this open when something is selected on the map.
		var mapInfoTopView = Ti.UI.createView({
			backgroundColor: 'black',
			top:'0%',
			height:'20%',
			visible: true,
			opacity:0.8
		});
		
		var mapSearchTopView = Ti.UI.createView({
			backgroundColor: 'black',
			top:'0%',
			height:'20%',
			visible: false,
			opacity:0.8
		});
		
		//when click this button, if the mapInfoTopView is open, it should close and the search top view will open.
		//if no top view is open, then the search top view will open.
		var mapViewSearchButton = Titanium.UI.createButton({
			image:'images/search-icon-80percent-opacity-border.png',
			top: '22%',
			height:'auto',
			width:'auto',
			backgroundColor:'gray',
			opacity:0.8,
			right:'5%'
		});
		mapViewSearchButton.addEventListener('click',function(e) {
			if(mapInfoTopView.visible === true) {
				mapInfoTopView.hide();
			}
			mapSearchTopView.show();
			Titanium.API.info("You clicked the button!");
		});
		
		//Search bar stuffs:
		var noteSearchLabelText = "Search for notes near a location:";
		
		var noteSearchLabel = Ti.UI.createLabel({
			text:noteSearchLabelText,
			top:'4%',
			left:'4%',
		    height:'auto',
		    width:'auto',
		    color:'#FFFFFF',
		    font:{fontSize:22,fontWeight:'bold',fontColor:'#FFFFFF'},
		    textAlign:'center'
		});
		
		var noteSearchLocationTxtField = Ti.UI.createTextField({
			backgroundColor:'#FFFFFF',
			left:'4%',
			top:'35%',
			width:'60%',
			height:'auto',
			borderColor:'#000000',
			borderRadius:5,
			hintText:'Enter a location',
			paddingLeft:10
		});
		
		var buttonSearchTopView = Ti.UI.createButton({
			title:'Search',
			width:125,
			height:50,
			top:'65%',
			right:'4%',
			borderRadius:3
		});
		buttonSearchTopView.addEventListener('click',function(e)
		{
			if(noteSearchLocationTxtField.value !== ''){
				Ti.Geolocation.forwardGeocoder(noteSearchLocationTxtField.value, function(e){
					//Set our mapview to this location so it appears on the screen
					mapview.region = {latitude: e.latitude, longitude: e.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02};
					Ti.API.info('Searched location co-ordinates are: ' + e.latitude + ' lat, ' + e.longitude + ' lon');
					//add an annotation to the mapview for one's current location
					//Also, the id # is what will allow us to tell which pin was tapped when we get to that point
					var newLocationAnnotation = Titanium.Map.createAnnotation({
						latitude: e.latitude, longitude: e.longitude, title: 'Searched Location', subtitle: noteSearchLocationTxtField.value, animate: true, id: 1, pincolor: Titanium.Map.ANNOTATION_GREEN
					});
					//add an image to the left of the annotation
					var leftAnnotationImage = Titanium.UI.createImageView({
						image: 'images/smile.png',
						width: 75,
						height: 75
					});
					newLocationAnnotation.leftView = leftAnnotationImage;
					//And add the annontation pin to the mapview
					mapview.addAnnotation(newLocationAnnotation);
					mapview.setLocation(mapview.region);
					//move current view to annotation location
					// Ti.Geolocation.getNewPosition(function(e) {
						// if (e.error) {
							// //if mapping location doesn't work, show an alert
							// alert('Sorry, but it seems that geolocation is not available on your device right now!');
							// //return;
						// }
						// //get properties from Ti.Geolocation
						// var longitude = e.coords.longitude;
						// var latitude = e.coords.latitude;
						// var altitude = e.coords.altitude;
						// var heading = e.coords.heading;
						// var accuracy = e.coords.accuracy;
						// var speed = e.coords.speed;
						// var timestamp = e.coords.timestamp;
						// var altitudeAccuracy = e.coords.altitudeAccuracy;
						// //Now, apply the longitude and latitude properties to our mapview
						// mapview.region = {latitude: latitude, longitude: longitude, latitudeDelta:0.02, longitudeDelta:0.02};
						// mapview.setLocation(mapview.region);
					// });
				});
			}
			else {
				alert('You must provide a location to search!');
			}
		});
		
		//create the event listener for when annotations are tapped on the map
		mapview.addEventListener('click', function(e){
			Ti.API.info('Annotation id that was tapped: ' + e.source.id);
		})
		
		mapSearchTopView.add(noteSearchLabel);
		mapSearchTopView.add(noteSearchLocationTxtField);
		mapSearchTopView.add(buttonSearchTopView);
		
		
		var noteNameString = "Note Name";
		//do calculations to translate long and lat while also listing long and lat in string.
		var noteAddressLocationString = "Long and Lat data";
		var noteReferenceAddressLocationString = "ADDRESS closeby, city, etc...";
		var numberNoteViews = "11";
		var noteViewsString = "You've viewed this note " + numberNoteViews + " times";
		
		var noteNameLabel = Ti.UI.createLabel({
		    text:noteNameString,
		    top:'4%',
		    height:'auto',
		    width:'auto',
		    color:'#FFFFFF',
		    font:{fontSize:22,fontWeight:'bold',fontColor:'#FFFFFF'},
		    textAlign:'center'
		});
		var noteAddressLocationLabel = Ti.UI.createLabel({
		    text:noteAddressLocationString,
		    top:'27%',
		    height:'auto',
		    width:'auto',
		    color:'#FFFFFF',
		    font:{fontSize:22,fontColor:'#FFFFFF'},
		    textAlign:'center'
		});
		var noteReferenceAddressLocationLabel = Ti.UI.createLabel({
		    text:noteReferenceAddressLocationString,
		    top:'50%',
		    height:'auto',
		    width:'auto',
		    color:'#FFFFFF',
		    font:{fontSize:22,fontWeight:'bold',fontColor:'#FFFFFF'},
		    textAlign:'center'
		});
		var noteViewsLabel = Ti.UI.createLabel({
		    text:noteViewsString,
		    top:'73%',
		    height:'auto',
		    width:'auto',
		    color:'#FFFFFF',
		    font:{fontSize:22,fontColor:'#FFFFFF'},
		    textAlign:'center'
		});
		
		mapInfoTopView.add(noteNameLabel);
		mapInfoTopView.add(noteAddressLocationLabel);
		mapInfoTopView.add(noteReferenceAddressLocationLabel);
		mapInfoTopView.add(noteViewsLabel);
		
		//add the map to the window
		win1.add(mapview);
		
		win1.add(mapViewSearchButton);
		win1.add(mapInfoTopView);
		win1.add(mapSearchTopView);
		
		//finally, open the window
		//win1.open();
		
		////////////////
		//END MapView Matthew Ibarra created since most/all of what I said I would do this build cycle was already completed
		////////////////

		//open the window
		return win1;
	};
})();
