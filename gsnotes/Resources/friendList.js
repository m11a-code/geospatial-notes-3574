friendList = {};


// Fetch a list of friends using the Facebook API
friendList.get = function() {
	if( Ti.Facebook.getLoggedIn() )	{
		
		// requestWithGraphPath vs Titanium.Facebook.Execute
		// Not really sure if there's a big difference, but this one works
		Titanium.Facebook.requestWithGraphPath('me/friends', {fields: 'first_name,last_name,id'}, 'GET', function(e) {
		    if(e.success){
		        var d = JSON.parse(e.result);
		        friendList.row = d.data;
		        
		       	friendList.showFriends();
		    }
		    else if( e.error ) {
		    	alert(e.error);
		    }
		});
	} else {
		alert( 'Not logged in');
	}
};

// Opens a window to interacct with a specific friend
// The parameters here will probaby change to just a local ID
// This can be cleaned up a bit by separating out UI elements
friendList.openFriend = function(firstName,lastName,friendID){
	var fullName = firstName + " " + lastName;
	var friendWindow = Ti.UI.createWindow({
		title:fullName
	});
	
	var friendView = Ti.UI.createView({
		borderRadius:10,
		width:'95%',
		height:'90%',
		backgroundColor:'#000',
		opacity:.5			
	});
	
	var image = Titanium.UI.createImageView({
		url:"https://graph.facebook.com/" + friend.id + "/picture"
	});
	
	friendView.add(image);
	
	friendWindow.add( friendView );
	
	friendView.addEventListener('click', function(){
		friendWindow.close();			
	});
	
	friendWindow.open();
};

// After fetching a list of friends using the API, do something with that data
friendList.showFriends = function() {
	var row = friendList.row;
	
	var friendCount = row.length;
	
	alert( friendCount + " friends");
	
	
	var friendWindow = Ti.UI.createWindow({
		backgroundColor:'#FFF'
	});
	var friendTable = Ti.UI.createTableView();
	
	for(c=0;c<friendCount;c++){
	    var friend = row[c];
	    var fullname = friend.first_name + " " + friend.last_name;
	 
	 	// Alternating background colors
	 	var bgColor = (c % 2 == 1) ? '#EEE' : '#FFF';
	 	
	 	// Create a row for this user
	    var tvRow = Ti.UI.createTableViewRow({
	        height:auto,
	        backgroundColor:bgColor,
	        title: fullname
	    });
	    
	    // Add a listener for that row
	    tvRow.addEventListener( 'click', function() {
	    	friendList.openFriend( friend.first_name, friend.last_name, friend.id );
	    });
	 	
	 	
		friendTable.appendRow( tvRow );	
	}
	
	friendWindow.add( friendTable );
	friendWindow.open();
}