(function() {
	gn.ui = gn.ui || {};
	var buildFilePath = function(latitude, longitude, friend) {
		var ourLat = latitude || "";
		var ourLong = longitude || "";
		var ourFriend = friend || "";
		var baseURL = Titanium.Filesystem.applicationDataDirectory + "/";
		return baseURL + ourFriend + "/lat_" + ourLat + "_long_" + ourLong;
	};

	Ti.App.addEventListener('recorder:recordNote', function(e) {
		// gn.ui.recordAudioNote(e.latitude, e.longitude, e.friend);
		var win = Ti.UI.createWindow({
			title : 'Sound Recorder Test',
			exitOnClose : true,
			fullscreen : false,
			backgroundColor : 'blue'
		});

		// const value grabbed from
		// http://developer.android.com/reference/android/provider/MediaStore.Audio.Media.html#RECORD_SOUND_ACTION
		var RECORD_SOUND_ACTION = "android.provider.MediaStore.RECORD_SOUND";
		var soundUri = null;
		// Will be set as a result of recording action.

		var recordButton = Titanium.UI.createButton({
			top : 10,
			left : 10,
			right : 10,
			height : 35,
			title : "Record Audio"
		});
		var labelResultCaption = Titanium.UI.createLabel({
			top : 50,
			left : 10,
			right : 10,
			height : 35,
			visible : false,
			color : 'yellow'
		});
		var labelResult = Titanium.UI.createLabel({
			top : 90,
			left : 10,
			right : 10,
			height : 100,
			visible : false,
			backgroundColor : 'white',
			color : 'black',
			verticalAlign : 'top'
		});

		recordButton.addEventListener('click', function() {
			var intent = Titanium.Android.createIntent({
				action : RECORD_SOUND_ACTION
			});
			Titanium.Android.currentActivity.startActivityForResult(intent, function(e) {
				if(e.error) {
					labelResultCaption.text = 'Error: ' + e.error;
					labelResultCaption.visible = true;
				} else {
					if(e.resultCode === Titanium.Android.RESULT_OK) {
						soundUri = e.intent.data;
						labelResultCaption.text = 'Audio Captured.  Content URI:';
						labelResult.text = soundUri;
						labelResultCaption.visible = true;
						labelResult.visible = true;
						sendButton.visible = true;
					} else {
						labelResultCaption.text = 'Canceled/Error? Result code: ' + e.resultCode;
						labelResultCaption.visible = true;
					}
				}
			});
		});

		win.add(recordButton);
		win.add(labelResultCaption);
		win.add(labelResult);
		win.open();
	});

	/*
	 gn.ui.recordAudioNote = function(latitude, longitude, friend) {
	 var audioRecorder = require('com.codeboxed.audiorecorder');

	 //All the methods below are optional, if they are not used the module will use default values for everything
	 audioRecorder.setAudioFormat("DEFAULT");
	 audioRecorder.setAudioEncoder("DEFAULT");
	 audioRecorder.setMaxDuration(40000);
	 audioRecorder.setMaxFileSize(1000000);
	 //in bytes
	 var filePath = buildFilePath(latitude, longitude, friend);
	 audioRecorder.setFileName(filePath, "3gp");
	 // overwrites the filename given by you above.

	 // VERY IMPORTANT: All files are saved in the root of the SDCARD,
	 // so for example if you use: audioRecorder.setFileName("myfile","3gp");
	 // the file "myfile.3gp" will be saved on the sdcard (/mnt/sdcard), so if you mount your SDCARD
	 // and browse it, you will find the file in the root.
	 // If you use audioRecorder.setFileName("myFolder/myfile","3gp");
	 // the file "myfile.3gp" will be saved on the SDCARD in the folder "myFolder". You get the idea :)
	 audioRecorder.start();

	 Ti.App.addEventListener('recorder:stopRecording', function(e) {
	 filePath = audioRecorder.stop();
	 Ti.App.removeEventListener(this);
	 //stop returns file generated after recording
	 });
	 };
	 */
	Ti.App.addEventListener('recorder:playNote', function(e) {
		var audioRecorder = require('com.codeboxed.audiorecorder');
		audioRecorder.playAudio(buildFilePath(e.latitude, e.longitude, e.friend));
	});
})();
