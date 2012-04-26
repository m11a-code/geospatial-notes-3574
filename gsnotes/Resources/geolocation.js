//Create Android Window
(function() {
	gn.ui = gn.ui || {};
	gn.ui.createGeolocationWindow = function() {

		//create the window
		var win1 = Titanium.UI.createWindow({
			title : 'MapView',
			backgroundColor : '#000',
			exitOnClose : false,
			fullscreen : false
		});
		win1.addEventListener('android:back', function() {
			win1.close();
		});
		win1.orientationModes = [Titanium.UI.PORTRAIT];

		//create our mapview
		var mapview = Titanium.Map.createView({
			height : '100%',
			mapType : Titanium.Map.STANDARD_TYPE,
			region : {								//London
				latitude : 51.50015,
				longitude : -0.12623,
				latitudeDelta : 0.02,
				longitudeDelta : 0.02
			},
			animate : true,
			regionFit : true,
			userLocation : true
		});

		//will eventually only have this open when something is selected on the map.
		var mapInfoTopView = Ti.UI.createView({
			backgroundColor : 'black',
			top : '0%',
			height : '20%',
			visible : true,
			opacity : 0.8
		});

		var mapSearchTopView = Ti.UI.createView({
			backgroundColor : 'black',
			top : '0%',
			height : '20%',
			visible : false,
			opacity : 0.8
		});

		//when click this button, if the mapInfoTopView is open, it should close and the search top view will open.
		//if no top view is open, then the search top view will open.
		var mapViewSearchButton = Titanium.UI.createButton({
			image : 'images/search-icon-80percent-opacity-border.png',
			top : '22%',
			height : 'auto',
			width : 'auto',
			backgroundColor : 'gray',
			opacity : 0.8,
			right : '5%'
		});
		mapViewSearchButton.addEventListener('click', function(e) {
			if(mapInfoTopView.visible === true) {
				mapInfoTopView.hide();
			}
			mapSearchTopView.show();
			Titanium.API.info("You clicked the button!");
		});

		//Search bar stuffs:
		var noteSearchLabelText = "Search for notes near a location:";

		var noteSearchLabel = Ti.UI.createLabel({
			text : noteSearchLabelText,
			top : '4%',
			left : '4%',
			height : 'auto',
			width : 'auto',
			color : '#FFFFFF',
			font : {
				fontSize : 22,
				fontWeight : 'bold',
				fontColor : '#FFFFFF'
			},
			textAlign : 'center'
		});

		var noteSearchLocationTxtField = Ti.UI.createTextField({
			backgroundColor : '#FFFFFF',
			left : '4%',
			top : '35%',
			width : '60%',
			height : 'auto',
			borderColor : '#000000',
			borderRadius : 5,
			hintText : 'Enter a location',
			paddingLeft : 10
		});

		var buttonSearchTopView = Ti.UI.createButton({
			title : 'Search',
			width : 125,
			height : 50,
			top : '65%',
			right : '4%',
			borderRadius : 3
		});
		buttonSearchTopView.addEventListener('click', function(e) {
			if(noteSearchLocationTxtField.value !== '') {
				Ti.Geolocation.forwardGeocoder(noteSearchLocationTxtField.value, function(e) {
					//Set our mapview to this location so it appears on the screen
					mapview.region = {
						latitude : e.latitude,
						longitude : e.longitude,
						animate: true,
						latitudeDelta : 0.001,
						longitudeDelta : 0.001
					};
					Ti.API.info('Searched location co-ordinates are: ' + e.latitude + ' lat, ' + e.longitude + ' lon');
					//add an annotation to the mapview for one's current location
					//Also, the id # is what will allow us to tell which pin was tapped when we get to that point
					var newLocationAnnotation = Titanium.Map.createAnnotation({
						latitude : e.latitude,
						longitude : e.longitude,
						title : 'Searched Location',
						subtitle : noteSearchLocationTxtField.value,
						animate : true,
						id : 1,
						pincolor : Titanium.Map.ANNOTATION_GREEN
					});
					//add an image to the left of the annotation
					var leftAnnotationImage = Titanium.UI.createImageView({
						image : 'images/smile.png',
						width : 75,
						height : 75
					});
					newLocationAnnotation.leftView = leftAnnotationImage;
					//And add the annontation pin to the mapview
					mapview.addAnnotation(newLocationAnnotation);
					mapview.setLocation(mapview.region);
				});
			} else {
				alert('You must provide a location to search!');
			}
		});

		//create the event listener for when annotations are tapped on the map
		mapview.addEventListener('click', function(e) {
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
			text : noteNameString,
			top : '4%',
			height : 'auto',
			width : 'auto',
			color : '#FFFFFF',
			font : {
				fontSize : 22,
				fontWeight : 'bold',
				fontColor : '#FFFFFF'
			},
			textAlign : 'center'
		});
		var noteAddressLocationLabel = Ti.UI.createLabel({
			text : noteAddressLocationString,
			top : '27%',
			height : 'auto',
			width : 'auto',
			color : '#FFFFFF',
			font : {
				fontSize : 22,
				fontColor : '#FFFFFF'
			},
			textAlign : 'center'
		});
		var noteReferenceAddressLocationLabel = Ti.UI.createLabel({
			text : noteReferenceAddressLocationString,
			top : '50%',
			height : 'auto',
			width : 'auto',
			color : '#FFFFFF',
			font : {
				fontSize : 22,
				fontWeight : 'bold',
				fontColor : '#FFFFFF'
			},
			textAlign : 'center'
		});
		var noteViewsLabel = Ti.UI.createLabel({
			text : noteViewsString,
			top : '73%',
			height : 'auto',
			width : 'auto',
			color : '#FFFFFF',
			font : {
				fontSize : 22,
				fontColor : '#FFFFFF'
			},
			textAlign : 'center'
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
		
		//Open before doing gps check so that the pop up notification appears IN the mapview screen instead of on the home screen like it was previously.
		win1.open();
		
		//This is required by Apple so it can inform the user of why you are accessing their location data
		Ti.Geolocation.purpose = "To obtain current user location for use of finding nearby notes to current user location.";
		Titanium.Geolocation.distanceFilter = 10;
		Ti.Geolocation.getCurrentPosition(function(e) {
			
			//get properties from Ti.Geolocation
			if(e && e.coords) {
				var longitude = e.coords.longitude;
				var latitude = e.coords.latitude;
				var altitude = e.coords.altitude;
				var heading = e.coords.heading;
				var accuracy = e.coords.accuracy;
				var speed = e.coords.speed;
				var timestamp = e.coords.timestamp;
				var altitudeAccuracy = e.coords.altitudeAccuracy;
				
				//Now, apply the longitude and latitude properties to our mapview
				mapview.region = {
					latitude : latitude,
					longitude : longitude,
					animate: true,
					latitudeDelta : 0.001,
					longitudeDelta : 0.001
				};
				mapview.setLocation(mapview.region);
			} else {
				Titanium.UI.createAlertDialog({
					title : 'Geolocation',
					message : 'Your device has geo turned off - turn it on please.',
					buttonNames : ['OK']
				}).show();
			}
		});

		return;
	};
})();
