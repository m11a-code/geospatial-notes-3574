(function() {
	
	gn.ui = gn.ui || {};
	
	gn.ui.createWelcomeScreen = function() {
		var win = Ti.UI.createWindow({
			title : 'welcome_screen',
			backgroundColor : 'black',
			exitOnClose:true,
			fullscreen:false
		});
		
		var activity = Ti.Android.currentActivity;
		
		activity.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			var menuItem = menu.add({ title: "Settings" });
				menuItem.setIcon(Titanium.Android.R.drawable.ic_menu_preferences);
				menuItem.addEventListener("click", function(e) {
					var settingsWindow = gn.ui.createSettingsWindow();
					settingsWindow.open();
			});
		}
	
		win.add(Titanium.Facebook.createLoginButton({
			top : 50,
			style : 'wide'
		}));

		var bInbox = Ti.UI.createButton({
			title : 'inbox',
			height : 60,
			width : '30%',
			bottom : 10,
			left : 10
		});
		bInbox.addEventListener('click', function() {
			var winInbox = gn.ui.createInboxWindow();
			winInbox.open();
		});
		win.add(bInbox);

		var bGeolocation = Ti.UI.createButton({
			title : 'Geolocation',
			height : 60,
			width : '30%',
			bottom : 70,
			left : 10
		});
		bGeolocation.addEventListener('click', function() {
			var winGeolocation = gn.ui.createGeolocationWindow();
			winGeolocation.open();
		});
		win.add(bGeolocation);

		var bLocation = Ti.UI.createButton({
			title : 'Location',
			height : 60,
			width : '30%',
			bottom : 70,
		});
		bLocation.addEventListener('click', function() {
			var winLocation = gn.ui.createLocationWindow();
			winLocation.open();
		});
		win.add(bLocation);

		var bOutbox = Ti.UI.createButton({
			title : 'Friends',
			height : 60,
			width : '30%',
			bottom : 10
		});
		bOutbox.addEventListener('click', function() {
			var winOutbox = gn.ui.createFriendsWindow();
			winOutbox.open();
		});
		win.add(bOutbox);

		var bOptions = Ti.UI.createButton({
			title : 'Options',
			height : 60,
			width : '30%',
			bottom : 10,
			right : 10
		});
		bOptions.addEventListener('click', function() {
			var winOptions = gn.ui.createSettingsWindow();
			winOptions.open();
		});
		win.add(bOptions);
		//win.add(view);

		return win;
	};
	
	
	
	
	
	gn.ui.createSettingsWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'settings_screen',
			//fullscreen: true,
			backgroundColor : 'green',
			exitOnClose:false,
			fullscreen:false
		});
		
		
		//rows
		
		var valuesColTen = [];
 
		for (var i = 0; i < 11; i++) {
		    valuesColTen.push(Ti.UI.createPickerRow({title: i+'', value:i}));
		}
		
		var valuesColHundred = [];
		
		for (var i = 0; i < 100; i=i+5) {
		    valuesColHundred.push(Ti.UI.createPickerRow({title: "."+i+" mi", value:i}));
		}
		
		//columns
		
		var columnValuesTen = Ti.UI.createPickerColumn( {
		    rows: valuesColTen, font: {fontSize: "12"}, width: '30%'
		});
 
		var columnValuesHundred = Ti.UI.createPickerColumn( {
		    rows: valuesColHundred, font: {fontSize: "12"}, width: '70%'
		});
 
		var picker = Ti.UI.createPicker({
			width: '100%',
			top: '20%',
		    useSpinner: true,
		    selectionIndicator: true,
		    columns: [columnValuesTen, columnValuesHundred]
		});
		
		var noteFilterButton = Ti.UI.createButton({
			title : 'Note Filters',
			width : '30%',
			bottom : 80
		});
		noteFilterButton.addEventListener('click', function() {
			var noteFilterWindow = gn.ui.createNoteFilterWindow();
			noteFilterWindow.open();
		});
 
		// turn on the selection indicator (off by default)
		win.add(picker);
		win.add(noteFilterButton);
		
		return win;
	};
	
	gn.ui.createNoteFilterWindow = function() {
		var win = Ti.UI.createWindow({
			fullscreen: true,
			backgroundColor: 'black',
			opacity: 0.6,
			height: '100%',
			width : '100%',
			exitOnClose:false,
			fullscreen:false
		});
		
		var tempView = Ti.UI.createView({
			backgroundColor: 'gray',
			height: '40%',
			left: '3%',
			right: '3%'
		});
		
		var tableData = [
		    Titanium.UI.createTableViewRow({title:'Facebook Friends\' Notes',hasCheck:false,font:{fontSize:'12dp',fontFamily:'Helvetica Neue',fontWeight:'bold',fontColor:'black'},color: 'black',header: "View Filters: Touch to toggle"}),
		    Titanium.UI.createTableViewRow({title:'My Notes',hasCheck:false,font:{fontSize:'12dp',fontFamily:'Helvetica Neue',fontWeight:'bold',fontColor:'black'},color: 'black'}),
		    Titanium.UI.createTableViewRow({title:'Public Notes',hasCheck:false,font:{fontSize:'12dp',fontFamily:'Helvetica Neue',fontWeight:'bold',fontColor:'black'},color: 'black'}),
		];
				 
		var tableView = Titanium.UI.createTableView({
		    data : tableData,
		    backgroundColor: 'gray',
		    color: 'black',
		    font:{fontSize:'12dp',fontFamily:'Helvetica Neue',fontWeight:'bold',fontColor:'black'} 
		});
		
		//unchecking one unchecks all which needs to be fixed
		//need to get better grasp of windows and how they work with back button
			//windows, views, when back exits app, when it doesn't, etc...
		//need to implememnt database and keep toggling info persistant
		//make UI components operate and flow smoother
		//need to get grasp of separating information into files more efficiently
		 
		tableView.addEventListener('click', function(e){
		    if(e.row.hasCheck){
		        for(var i in tableData){
		            tableData[i].hasCheck = false;
		        }
		        tableView.data = tableData;
		    } else {
		        tableData[e.index].hasCheck = true;
		        tableView.data = tableData;
		    }
		});
		
		tempView.add(tableView);
		win.add(tempView);
		return win;
	};

	gn.ui.createInboxWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'All Notes',
			backgroundColor : 'white',
			exitOnClose:false,
			fullscreen:false
		});

		/*
		var view = Titanium.UI.createView({
			borderRadius : 10,
			width : '95%',
			height : '95%',
			backgroundColor : 'white'
		});

		win.add(view);
		*/
		
		// Get all notes. The mode parameter is ready to be changed, but the UI hasn't been fully implemented yet
		var data = gn.db.getNotes({
			mode : 'all'
		});
		
		var table = Ti.UI.createTableView();
		win.add(table);
		
		
		// Traverse the list of notes and add them row by row
		while( data.isValidRow() )
		{
			var row = Ti.UI.createTableViewRow({
				title : data.fieldByName('noteName') + '...' //should be noteName, I forgot to enter it in the only entry so it would show up as blank
			});
			
			table.appendRow(row);
			
			data.next();
		}
		
		
		// Add optoin to create a dummy note
		var addDummy = Ti.UI.createTableViewRow({
			title : 'Add dummy note'
		});
		
		addDummy.addEventListener( 'click', function() {
			gn.db.saveNote( {
				noteName : 'Dummy note!' + Math.floor(Math.random()*1000),
				noteContent : 'Dummy Note! Wooo',
				noteLatitude : '1.000000',
				noteLongitude : '1.0000',
				noteDateCreated : Math.round((new Date()).getTime() / 1000 ), //unix timestamp
				noteGroupID : 0 //Only shared with self
				
			});	
			
			alert('Dummy note was added. Load the notes list again to see');
		});
		
		table.appendRow(addDummy);

		return win;
	};

	gn.ui.createOutboxWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'Outbox',
			backgroundColor : 'white',
			exitOnClose:false,
			fullscreen:false
		});

		var view = Titanium.UI.createView({
			borderRadius : 10,
			width : '95%',
			height : '95%',
			backgroundColor : 'black'
		});
		win.add(view);

		return win;
	};

	gn.ui.createOptionsWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'Options',
			backgroundColor : 'white',
			exitOnClose:false,
			fullscreen:false
		});

		var view = Titanium.UI.createView({
			borderRadius : 10,
			width : '95%',
			height : '95%',
			backgroundColor : 'black'
		});

		win.add(view);
		return win;
	};
})();
