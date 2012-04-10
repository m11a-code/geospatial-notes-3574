(function() {
	gn.db = gn.db || {};
	var db = Ti.Database.install('geonotes3.sqlite', 'geonotes30');
	
	// Returns an array of notes to display
	gn.db.getNotes = function(params) {
		var query = '';
		var mode = params.mode;
		var searchParams = params.searchParams;
		switch( mode ) {
			case 'group':
				var groupID = params.groupID;
				query = "SELECT * FROM `notes` WHERE notesGroupID = '" + groupID + "' ORDER BY noteDateCreated DESC";
				break;

			case 'sharedWith':
				query = "SELECT notes.*,groups.groupSize FROM notes,groups,people" + " WHERE notes.noteGroupID=groups.groupID" + " AND people.groupID=groups.groupID" + " AND people.facebookID=" + params.facebookID;
				break;

			case 'nearby':
				query = "SELECT * FROM `notes` WHERE" + " noteLatitude < " + searchParams.latitude + " AND noteLatitude > " + searchParams.latitude + " AND noteLogitude < " + searchParams.latitude + " AND noteLongitude > "+ searchParams.latitude + " ORDER BY noteDate DESC";
				break;

			case 'self':
				// Any note with groupID = 0 is not shared with anybody besides the creator.
				query = "SELECT * FROM `notes` WHERE notesGroupID = 0 ORDER BY noteDateCreated DESC";
				break;

			case 'all':
				query = 'SELECT * FROM `notes` ORDER BY noteDateCreated DESC';
				break;
		}

		return db.execute(query);
	};

	gn.db.saveNote = function(params) {
		// Use parameters for all the note content
		// Or an array?

		db.execute('INSERT INTO `notes` ' + '(noteName, noteContent, noteLatitude, noteLongitude, noteDateCreated, noteGroupID) ' + 'VALUES ' + '("' + params.noteName + '","' + params.noteContent + '","' + params.noteLatitude + '","' + params.noteLongitude + '","' + params.noteDateCreated + '","' + params.noteGroupID + '")');

	};
	
	gn.db.clearFBFriends = function() {
		
		db.execute('DROP TABLE facebookFriends');
		db.execute('CREATE TABLE facebookFriends (fbPrimaryKey INTEGER PRIMARY KEY, fbID NUMERIC, fbFirstName TEXT, fbLastName TEXT, fbFullName TEXT);');
	};
	
	gn.db.addFBFriend = function(id,fname,lname){
		fname = gn.db.addslashes(fname);
		lname = gn.db.addslashes(lname);
		db.execute('INSERT INTO facebookFriends (fbID,fbFirstName,fbLastName,fbFullName) VALUES ("' + id + '", "' +fname + '", "' + lname + '", "' + fname + ' ' + lname + '")');

	};
	
	gn.db.getFBFriends = function(params){
		
		switch(params.filter_mode){
			case 'first_name':
				//query = 'SELECT * FROM facebookFriends WHERE first_name';
			break;
			
			case 'last_name':
			
			break;
			
			case 'fullName':
				// Default is by full name
				query = 'SELECT * FROM facebookFriends WHERE fbFullName LIKE "%' + params.filter + '%" ORDER BY fbFullName ASC LIMIT ' + params.start + ',' + params.limit;
			break;
			
			default:
				query = 'SELECT * FROM facebookFriends ORDER BY fbFullName ASC LIMIT ' + params.start + ',' + params.limit;
			
			
		}
		
		return db.execute(query);
		
	}
	
	gn.db.addslashes = function(str) {
	    // Escapes single quote, double quotes and backslash characters in a string with backslashes  
	    // 
	    // version: 1109.2015
	    // discuss at: http://phpjs.org/functions/addslashes
	    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   improved by: Ates Goral (http://magnetiq.com)
	    // +   improved by: marrtins
	    // +   improved by: Nate
	    // +   improved by: Onno Marsman
	    // +   input by: Denny Wardhana
	    // +   improved by: Brett Zamir (http://brett-zamir.me)
	    // +   improved by: Oskar Larsson Högfeldt (http://oskar-lh.name/)
	    // *     example 1: addslashes("kevin's birthday");
	    // *     returns 1: 'kevin\'s birthday'
    	return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	}
	
	
})();
