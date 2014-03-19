# ssid-checkin app

to build a mac app:

```
npm install
npm run build
```

then look in `build/releases/SSIDCheckin/mac` for your app

currently you have to set your token manually.

right click on the app in finder and 'Show Package Contents', then edit `Contents/Resources/app.nw/token.txt`

to edit venues: `Contents/Resources/app.nw/venues.json`
