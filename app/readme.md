# ssid-checkin app

to build a mac app:

```
npm install
npm run build
```

then look in `build/releases/SSIDCheckin/mac` for your app

make sure you set your ENV `FSQTOKEN` variable and then run the app.

to edit venues right click on the app in finder and 'Show Package Contents', then edit `Contents/Resources/app.nw/venues.json`
