
```
Titanium.geolocation.getDistanceFilter();

Titanium.Geolocation.ACCURACY_BEST

Titanium.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_BEST);


if(Titanium.Geolocation.getLocation.error === ERROR_HEADING_FAILURE)
       Ti.API.info('Can't tell you where you were going!');


var Notes = {};
var Notes.Geolocation = {};

Notes.Geolocation

Notes.geolocation.foo(e) = function{

Ti.Geolocation.addEventListener('location', function(e){
       if(e.error){
               Ti.API.error(e.error);
       }
});
};

Ti.App.addEventListener('ui:makeHomeScreen', function(details){
       var color = details.color;
       var time = details.time
       Notes.ui.makeHomeScreen(color, time);
});


Ti.App.fireEvent('ui:makeHomeScreen', {color:'blue', time:currentTime});
```

Not guaranteeing syntax is correct.