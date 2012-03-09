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
		gn.ui.recordAudioNote(e.latitude, e.longitude, e.friend);
	});
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

	Ti.App.addEventListener('recorder:playNote', function(e) {
		var audioRecorder = require('com.codeboxed.audiorecorder');
		audioRecorder.playAudio(buildFilePath(e.latitude, e.longitude, e.friend));
	});
})();
