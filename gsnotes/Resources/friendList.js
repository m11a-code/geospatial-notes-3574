(function() {
	gn.ui = gn.ui || {};
	gn.ui.friendList = {};
	gn.ui.createFriendsWindow = function() {

		var friendWindow = Ti.UI.createWindow({
			backgroundColor : '#FFF',
			exitOnClose : false,
			fullscreen : false
		});

		friendWindow.addEventListener('open', function() {
			Ti.App.fireEvent('app:getFriends');
		});
		var friendTable = Ti.UI.createTableView();
		friendWindow.add(friendTable);

		Ti.App.addEventListener('app:showFriends', function(params) {
			var data = params.data;
			var friendCount = data.length;
			for(var c = 0; c < friendCount; c++) {
				var friend = data[c];
				var fullname = friend.first_name + " " + friend.last_name;

				// Alternating background colors
				var bgColor = (c % 2 === 1) ? '#EEE' : '#FFF';

				// Create a row for this user
				var tvRow = Ti.UI.createTableViewRow({
					height : 'auto',
					backgroundColor : bgColor,
					title : fullname,
					className : 'foo', //it doesn't matter what this is, it just needs to be a string and the same for all rows that are the same
					firstName : friend.first_name,
					lastName : friend.last_name,
					friendID : friend.id
				});

				// Add a listener for that row
				tvRow.addEventListener('click', function() {
					Ti.App.fireEvent('app:openFriend', {
						firstName : this.firstName,
						lastName : this.lastName,
						friendID : this.friendID
					});
				});
				friendTable.appendRow(tvRow);
			}
		});

		// Fetch a list of friends using the Facebook API
		Ti.App.addEventListener('app:getFriends', function() {
			if(Ti.Facebook.getLoggedIn()) {
				// requestWithGraphPath vs Titanium.Facebook.Execute
				// Not really sure if there's a big difference, but this one works
				Titanium.Facebook.requestWithGraphPath('me/friends', {
					fields : 'first_name,last_name,id'
				}, 'GET', function(e) {
					if(e.success) {
						var d = JSON.parse(e.result);
						Ti.App.fireEvent('app:showFriends', {
							data : d.data
						});
					} else if(e.error) {
						alert(e.error + ' please ensure you are logged in correctly from the main screen.');
						setTimeout(function() {
							friendWindow.close();
						}, 2000);
					}
				});
			} else {
				alert('Not logged in');
			}
		});
		
		
		//event params: firstName, lastName, friendID
		Ti.App.addEventListener('app:openFriend', function(params) {
			var firstName = params.firstName;
			var lastName = params.lastName;
			var friendID = params.friendID;
			var fullName = firstName + " " + lastName;
			var friendWindow = Ti.UI.createWindow({
				title : fullName
			});
			
			var friendView = Ti.UI.createView({
				borderRadius : 10,
				width : '95%',
				height : '90%',
				backgroundColor : '#000',
				opacity : .5
			});

			var image = Titanium.UI.createImageView({
				url : "https://graph.facebook.com/" + friendID + "/picture",
				height : '50px',
				width : '50px',
				top : 15,
				left : 15
			});

			var sharedNotesButton = Ti.UI.createButton({
				title : 'See notes shared with ' + firstName,
				top : 60
			});
			
			var createNotesButton = Ti.UI.createButton({
				title : 'Create new shared note',
				top : 95
			})
			
			sharedNotesButton.addEventListener( 'click', function(){
				gn.ui.createInboxWindow().open();
			
			/*
				 var win = Ti.UI.createWindow({
					backgroundColor : 'white',
					title : 'Notes shared with ' + firstName,
					exitOnClose : false
				})
				
				
				win.open();
				*/
				
			});
			
			createNotesButton.addEventListener( 'click', function(){
				var win = Ti.UI.createWindow({
					backgroundColor : 'white',
					title : 'Create new note to share with ' + firstName,
					exitOnClose : false
				})
				win.open();
				
				
			});
			
			friendView.add(image);
			friendView.add( sharedNotesButton);
			friendView.add(createNotesButton);
			friendWindow.add(friendView);

			friendView.addEventListener('click', function() {
				friendWindow.close();
			});
			
			
			
			friendWindow.open();
		});
		return friendWindow;
	};
})();
