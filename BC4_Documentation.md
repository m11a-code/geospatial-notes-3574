# Changes #
  * Add map view in geolocation tab. (Matt)
  * Implement search button to open a top search view. (Matt)
  * Make top search view add the searched location to the map with a dot (green in color for now). Involves converting address to long and lat values so map can perform the location find and place the annotation (the dot). (Matt)
  * Friends are saved to a local database after being loaded from Facebook to allow faster access afterwards
  * Friends list is now sorted alphabetically
  * Friends list can be filtered with a search box
  * On the locations tab, user can associate a note with the current location.  When a user is within 10% of the current latitude and longitude, the note saved will be displayed as a notification.  The notification setting is delayed so as to not notify immediately, and the polling interval after that is 1-5 minutes.  This has bugs if the phone's having trouble getting location.


# Known Bugs #
  * Clicking a user in the friends list will open his/her window up 3 times, stacked on top of each other. Click the window 3 times to close the view
  * The user has to click a button to filter friends list, instead of having it filtered as the user types.
  * Using a blank filter to show all friends is faster than loading friends after clicking Friends from the main window.