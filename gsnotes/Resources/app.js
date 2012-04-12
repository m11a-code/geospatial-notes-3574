Titanium.UI.setBackgroundColor('#ffffff');

var gn = gn || {};
Ti.include('friendList.js', 'record.js', 'database.js', 'locations.js', 'geolocation.js', 'ui.js', 'gps.js');

Titanium.Facebook.appid = '166092423474222';
Titanium.Facebook.permissions = ['read_stream', 'manage_pages'];
Titanium.Facebook.addEventListener('login', function(e) {
	if(e.success) {
		alert('Logged in');
	}
});

Titanium.Facebook.addEventListener('logout', function(e) {
	alert('Logged out');
});
var wins = gn.ui.createWelcomeScreen();
wins.open();
