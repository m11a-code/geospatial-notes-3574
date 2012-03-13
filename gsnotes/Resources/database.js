(function() {
	gn.ui = gn.ui || {};
	
	var db = Ti.Database.install( 'geonotes.sqlite', 'geonotes');
	
	// Returns an array of notes to display
	function getNotes( mode )
	{
		var query = '';
		
		switch( mode )
		{
			case 'all':
				query = 'SELECT * FROM `notes` ORDER BY noteDate DESC';
			break;
			
			case 'group':
				var groupID = params.groupID;
				query = "SELECT * FROM `notes` WHERE notesGroupID = '" + groupID + "' ORDER BY noteDate DESC";
			
			case 'sharedWith':
				query = "SELECT * FROM `groups` WHERE facebookID = '" + params.facebookID + "'";
				var rows = db.execute( query );
				
				// That query gives us a list of groups
				// Use the result groupID to then search for notes
				
				//query = "SELECT * FROM `notes` WHERE ";
				//query += "noteGroupID = groupID OR noteGroupID = groupID2 OR ..."
				//query += "ORDER BY noteDate DESC";
			
			break;
			
			case 'nearby':
				query = "SELECT * FROM `notes` WHERE";
				query += " noteLatitude < SOMETHING AND noteLatitude > SOMETHING"
				query += " AND noteLogitude < SEOMTHING AND noteLongitude > SOMETHING";
				query += " ORDER BY noteDate DESC";
			break;
			
			case 'self':
				// Any note with groupID = 0 is not shared with anybody besides the creator.
				query = "SELECT * FROM `notes` WHERE notesGroupID = 0 ORDER BY noteDate DESC";
			break;
		}
		
		var rows = db.execute( query );
		var data = [];
		
		while( rows.isValidRow() )
		{
			// Put the result in the data array.
			
			
			
			rows.next();
		}
		
		return data;
	}
	
	
	/*
	
	function saveNote() {
		// Use parameters for all the note content
		// Or an array?	
		
		db.execute( "INSERT INTO `notes` 
		(noteName, noteContent, noteLatitude, noteLogitude, noteDateCreated, noteGroupID) 
		VALUES 
		( ... )
		");
	}
	
	
	
	gn.ui.displayAllNotes = function() {
		var data = getNotes( 'all' );
		
		
		
		
	};
	
	gn.ui.displaySelfNotes = function() {
		var data = getNotes( 'self' );
		
	}
	
	gn.ui.displayGroupNotes = function() {
		var data = getNotes( 'group', {
			groupID : 
		});
		
		
		
	}
	
	*/
	
	
	
	


	
})();