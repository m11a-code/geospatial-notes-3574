(function() {
	
	gn.ui = gn.ui || {};
	
	gn.ui.createWelcomeScreen = function() {
		var win = Ti.UI.createWindow({
			title : 'welcome_screen',
			backgroundColor : 'black',
			exitOnClose:true,
			fullscreen:false,
			touchEnabled: false
		});
		
		var geoEventListener = function(e) {
			if (e.error) {
				alert('Error: ' + e.error);
			} else {
				Ti.API.info(e.coords);
			}
		}
		
		if (Ti.Geolocation.locationServicesEnabled) {
			Titanium.Geolocation.purpose = 'Get Current Location';
			Titanium.Geolocation.addEventListener('location', geoEventListener);
		} else {
			alert('Please enable location services');
		}
		
		win.add(Titanium.Facebook.createLoginButton({
			top : 50,
			style : 'wide'
		}));

		var bInbox = Ti.UI.createButton({
			title : 'Inbox',
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
			gn.ui.createGeolocationWindow();
		});
		win.add(bGeolocation);

		var bLocation = Ti.UI.createButton({
			title : 'Location',
			height : 60,
			width : '30%',
			bottom : 70,
		});
		bLocation.addEventListener('click', function() {
			gn.ui.createLocationWindow().open();
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

		var bGPS = Ti.UI.createButton({
			title : 'GPS',
			height : 60,
			width : '30%',
			bottom : 70,
			right : 10
		});
		bGPS.addEventListener('click', function() {
			var winGPS = gn.ui.createGPSWindow();
			winGPS.open();
		});
		win.add(bGPS);

		return win;
	};
	
	
	
	
	
	gn.ui.createSettingsWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'settings_screen',
			//fullscreen: true,
			backgroundColor : 'black',
			exitOnClose:false,
			fullscreen:false
		});
		//rows
		
		var valuesColHundred = [];
		
		for (var i = 0; i < 100; i=i+10) {
		    valuesColHundred.push(Ti.UI.createPickerRow({
		    	title: i+" %",
		    	value:i
		    }));
		}
		
		//columns
		var columnValuesHundred = Ti.UI.createPickerColumn( {
		    rows: valuesColHundred, font: {fontSize: "12"}, width: '100%'
		});
 
		var picker = Ti.UI.createPicker({
			width: '100%',
			top: '20%',
		    useSpinner: true,
		    selectionIndicator: true,
		    columns: [columnValuesHundred]
		});
		
		var noteFilterButton = Ti.UI.createButton({
			title : 'Note Filters',
			width : '30%',
			bottom : 80
		});
		noteFilterButton.addEventListener('click', function() {
			gn.ui.createNoteFilterWindow().open();
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
		    e.row.hasCheck = !e.row.hasCheck;
		    tableView.data = tableData;
		});
		
		tempView.add(tableView);
		win.add(tempView);
		return win;
	};
	
	gn.ui.createNoteWindow = function(params) {
		data = gn.db.getNote({
			noteID : params.noteID
		});
		
		
		if( data.isValidRow() && data.getRowCount() > 0) {
			var win = Ti.UI.createWindow({
				title : data.fieldByName('noteName'),
				backgroundColor : 'white',
				exitOnClose : false,
				fullscreen : true
			});
			

			var content = Ti.UI.createLabel({
				html : '<b>Created</b>: <br />' + new Date(data.fieldByName('noteDateCreated') * 100) + '<br />' 
						+ '<b>Longitude:</b><br />' + data.fieldByName('noteLongitude') + '<br />'
						+ '<b>Latitude:</b><br />' + data.fieldByName('noteLatitude') + '<br />'
						+ '<b>Content:</b><br />' + data.fieldByName('noteContent'),
				color : 'black',
				top : '15px'
			});
			
			var deleteButton =  Titanium.UI.createButton({
			   title: 'Delete Note',
			   bottom: '10px',
			   right: '10px',
			   width: '30%',
			   height: 50,
			   noteID : data.fieldByName('noteID')
			});
			
			deleteButton.addEventListener('click', function() {
				var dialog = Titanium.UI.createAlertDialog({
					title : 'Delete',
    				message : 'Are you sure you want to delete this note?',
				    buttonNames : ['Delete','Cancel'],
				    cancel :1,
				    noteID : this.noteID
				});
				dialog.show();
				
				
				dialog.addEventListener('click', function(e) {

					if(e.index){
						// Cancel
					} else {
						// delete
						gn.db.deleteNote({
							noteID : this.noteID
						});
						
						alert('Note deleted!');
					}
				})
				
			});
			
			win.add(deleteButton);
			win.add(content);
			
			return win;
		}
		

	};
	
	
	gn.ui.createInboxWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'All Notes',
			backgroundColor : 'white',
			exitOnClose:false,
			fullscreen:false
		});

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
				title : data.fieldByName('noteName') + '...',
				noteID : data.fieldByName('noteID'),
				color : 'black'
			});
			
			row.addEventListener('click', function(){
				// Clicking on a note
				gn.ui.createNoteWindow({
					noteID : this.noteID
				}).open();
			});
			
			
			table.appendRow(row);
			
			data.next();
		}
		
		
		// Add optoin to create a dummy note
		/*
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
		*/
		
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
