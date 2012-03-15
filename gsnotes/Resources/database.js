// Had to use 'geonotes2' because I wanted to add some entries ahead of time
var db = Ti.Database.install( 'geonotes2.sqlite', 'geonotes2');


// Returns an array of notes to display
var getNotes = function( params )
{
	var query = '';
	var mode = params.mode;
	switch( mode )
	{
		case 'group':
			var groupID = params.groupID;
			query = "SELECT * FROM `notes` WHERE notesGroupID = '" + groupID + "' ORDER BY noteDateCreated DESC";
		break;
		
		case 'sharedWith':
			query = "SELECT notes.*,groups.groupSize FROM notes,groups,people" +
					" WHERE notes.noteGroupID=groups.groupID" +
					" AND people.groupID=groups.groupID" +
					" AND people.facebookID=" + params.facebookID;
		break;
		
		case 'nearby':
			query = "SELECT * FROM `notes` WHERE" +
					" noteLatitude < SOMETHING AND noteLatitude > SOMETHING" +
					" AND noteLogitude < SEOMTHING AND noteLongitude > SOMETHING" +
					" ORDER BY noteDate DESC";
		break;
		
		case 'self':
			// Any note with groupID = 0 is not shared with anybody besides the creator.
			query = "SELECT * FROM `notes` WHERE notesGroupID = 0 ORDER BY noteDateCreated DESC";
		break;
		
		case 'all':
			query = 'SELECT * FROM `notes` ORDER BY noteDateCreated DESC';
		break;
	}
	
	return db.execute( query );
	

}
	


	
function saveNote(params) {
	// Use parameters for all the note content
	// Or an array?	
	
	db.execute( 'INSERT INTO `notes` ' +
	'(noteName, noteContent, noteLatitude, noteLongitude, noteDateCreated, noteGroupID) ' +
	'VALUES ' +
	'("' + params.noteName + '","' + params.noteContent + '","' + params.noteLatitude + '","' + params.noteLongitude + '","' + params.noteDateCreated + '","' + params.noteGroupID + '")' );
	
	
}