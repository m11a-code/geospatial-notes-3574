Titanium.UI.setBackgroundColor('#ffffff');

var gn = gn || {};
Ti.include('ui.js');
Ti.include('geolocation.js');
Ti.include('locations.js');
Ti.include('friendList.js');


Titanium.Facebook.appid = '166092423474222';
Titanium.Facebook.permissions = ['read_stream', 'manage_pages'];

if( Ti.Facebook.getLoggedIn() )	{
	friendList.get();
} else {
	Titanium.Facebook.addEventListener('login', function(e) {
	   friendList.get();
	});

}

Titanium.Facebook.addEventListener('logout', function(e) {
	alert('Logged out');
});

var wins = gn.ui.createWelcomeScreen();
wins.open();
