TUSHI'S BIRTHDAY SURPRISE

OPEN THE WEBSITE
Double-click index.html. It runs as a self-contained local website; no installation is needed.

PERSONALIZE IT
Open config.js in a text editor. You can change Tushi's name, your name, her birthday date, birthday greeting, love letter, captions, reasons, birthday chant, and final message there.

PHOTOS
The six supplied photos are in assets/. Replace a photo while keeping its filename, or change the paths and captions in the photos list in config.js. Keep each replacement photo in the assets folder.

RELATIONSHIP COUNTER
Set relationshipStart in config.js to your date and local time, for example:
relationshipStart: '2024-01-01T00:00:00',

MUSIC
Your supplied birthday song is stored as assets/tushi-birthday-song.mp3. It plays when the envelope opens. The floating player also has play/pause and mute controls. To replace it, add a new audio file in assets/ and update musicFile and musicTitle in config.js.

BIRTHDAY BAND
Opening the envelope reveals a dancing character band while your song plays. A floating music note appears in the middle of the band while the song is playing; lyrics are not displayed.

The design uses Google Fonts when an internet connection is available and falls back to system fonts otherwise.
