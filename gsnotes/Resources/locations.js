(function() {
	gn.ui = gn.ui || {};
	gn.ui.createLocationWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'inbox',
			backgroundColor : 'blue',
			exitOnClose:false,
			fullscreen:false
		});
		
		win.addEventListener('android:back',function(){
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
		});
		var recallButton = Ti.UI.createButton({
			title : 'Recall note',
			height : 60,
			width : '90%',
			bottom : 70
		});
		recallButton.addEventListener('click', function() {
			var latNote = Ti.App.Properties.getString(latitudeField.value, '-1');
			var longNote = Ti.App.Properties.getString(longitudeField.value, '-2');
			if(longNote === latNote){
				noteField.setValue(Ti.App.Properties.getString(longitudeField.value, ''));
			}
		});
		win.add(latitudeField);
		win.add(noteField);
		win.add(longitudeField);
		win.add(saveButton);
		win.add(recallButton);
		return win;
	};
})();
