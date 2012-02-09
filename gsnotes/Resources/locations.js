(function() {
	gn.ui = gn.ui || {};
	gn.ui.createLocationWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'inbox',
			backgroundColor : 'blue'
		});

		var latitudeField = Titanium.UI.createTextField({
			color : '#336699',
			height : 45,
			bottom : 260,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			clearOnEdit : true,
			hintText : 'Latitude',
			width : 250
		});

		var longitudeField = Titanium.UI.createTextField({
			color : '#336699',
			height : 45,
			bottom : 210,
			width : 250,
			hintText : 'Longitude',
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
				Ti.App.Properties.setString("latitude", latitudeField.value);
				Ti.App.Properties.setString('longitude', longitudeField.value);
		});
		var recallButton = Ti.UI.createButton({
			title : 'Recall Location',
			height : 60,
			width : '90%',
			bottom : 70
		});
		recallButton.addEventListener('click', function() {
			latitudeField.setValue(Ti.App.Properties.getString('latitude', ''));
			longitudeField.setValue(Ti.App.Properties.getString('longitude', ''));
		});
		win.add(latitudeField);
		win.add(longitudeField);
		win.add(saveButton);
		win.add(recallButton);
		var b = Ti.UI.createButton({
			title : 'back',
			height : 60,
			width : '90%',
			bottom : 10
		});
		b.addEventListener('click', function() {
			win.close();
		});
		win.add(b);

		return win;
	};
})();
