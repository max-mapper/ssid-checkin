# ssid-checkin

experimental

inspired by https://github.com/wijnanb/SSID-FourSquare-Checkin

## how to use

1. set env variable `FSQTOKEN` to a foursquare API token for your user account, or pass the token in as `process.argv[2]` below

2. make a file called `venues.json` with data like this:

```
{
  "cafe3016": "51a1a818498e8fe19886b480"
}
```

(ssid on the left, foursquare venue id on the right)


3. install, then run in the same folder as `venues.json`:

```
npm install ssid-checkin -g
ssid-checkin
```
