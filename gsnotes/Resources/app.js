Titanium.UI.setBackgroundColor('#ffffff');

var gn = gn || {};
Ti.include('friendList.js', 'record.js', 'database.js', 'locations.js', 'geolocation.js', 'ui.js', 'gps.js');

Titanium.Facebook.appid = '166092423474222';
Titanium.Facebook.permissions = ['read_stream', 'manage_pages'];


Titanium.Facebook.addEventListener('login', function(e) {
	if(e.success) {
		var toast = Titanium.UI.createNotification({
		    duration: Ti.UI.NOTIFICATION_DURATION_LONG,
		    message: "Log in successful."
		});
		toast.show();
	}
});

Titanium.Facebook.addEventListener('logout', function(e) {
	var toast = Titanium.UI.createNotification({
	    duration: Ti.UI.NOTIFICATION_DURATION_LONG,
	    message: "Log out successful."
	});
	toast.show();
});
var wins = gn.ui.createWelcomeScreen();
wins.open();
