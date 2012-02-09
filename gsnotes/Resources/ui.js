(function() {
	gn.ui = {};

	gn.ui.createWelcomeScreen = function() {
		var win = Ti.UI.createWindow({
			title : 'welcome_screen',
			//layout:'vertical',
			backgroundColor : 'red'
		});

		var view = Titanium.UI.createView({
			borderRadius : 10,
			width : '95%',
			height : '95%',
			backgroundColor : 'red'
		});

		view.add(Titanium.Facebook.createLoginButton({
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
		view.add(bInbox);

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
		view.add(bGeolocation);

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
		view.add(bLocation);

		var bOutbox = Ti.UI.createButton({
			title : 'Outbox',
			height : 60,
			width : '30%',
			bottom : 10
		});
		bOutbox.addEventListener('click', function() {
			var winOutbox = gn.ui.createOutboxWindow();
			winOutbox.open();
		});
		view.add(bOutbox);

		var bOptions = Ti.UI.createButton({
			title : 'Options',
			height : 60,
			width : '30%',
			bottom : 10,
			right : 10
		});
		bOptions.addEventListener('click', function() {
			var winOptions = gn.ui.createOptionsWindow();
			winOptions.open();
		});
		view.add(bOptions);
		win.add(view);

		return win;
	};

	gn.ui.createInboxWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'Inbox',
			backgroundColor : 'blue'
		});

		var view = Titanium.UI.createView({
			borderRadius : 10,
			width : '95%',
			height : '95%',
			backgroundColor : 'red'
		});

		var b = Ti.UI.createButton({
			title : 'Back',
			height : 60,
			width : '90%',
			bottom : 10
		});
		b.addEventListener('click', function() {
			win.close();
		});
		view.add(b);
		win.add(view);

		return win;
	};

	gn.ui.createOutboxWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'Outbox',
			backgroundColor : 'blue'
		});

		var view = Titanium.UI.createView({
			borderRadius : 10,
			width : '95%',
			height : '95%',
			backgroundColor : 'red'
		});

		var b = Ti.UI.createButton({
			title : 'Back',
			height : 60,
			width : '90%',
			bottom : 10
		});
		b.addEventListener('click', function() {
			win.close();
		});
		view.add(b);
		win.add(view);

		return win;
	};

	gn.ui.createOptionsWindow = function() {
		var win = Ti.UI.createWindow({
			title : 'Options',
			backgroundColor : 'blue'
		});

		var view = Titanium.UI.createView({
			borderRadius : 10,
			width : '95%',
			height : '95%',
			backgroundColor : 'red'
		});

		var b = Ti.UI.createButton({
			title : 'Back',
			height : 60,
			width : '90%',
			bottom : 10
		});
		b.addEventListener('click', function() {
			win.close();
		});
		win.add(view);
		view.add(b);

		return win;
	};
})();
