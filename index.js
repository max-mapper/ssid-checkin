var request = require('request')
var cmd = require('child_process')
var fs = require('fs')

var token = process.env['FSQTOKEN']
var lastSsid = ""

checkin()

function wait() {
  setTimeout(checkin, 1000 * 60 * 5)
}

function checkin() {
  var ssids = JSON.parse(fs.readFileSync('venues.json'))
  
  // OSX only
  var airport = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I" +
                " | awk '/ SSID/ {print substr($0, index($0, $2))}'"
  
  cmd.exec(airport, done)
  
  function done(err, stdo, stde) {
    if (err) return console.error(err)
    var ssid = stdo.trim()
    
    var fsqid = ssids[ssid]
    if (!fsqid) {
      wait()
      return console.log(ssid, 'not in whitelist')
    }
    if (lastSsid === ssid) {
      wait()
      return console.log('Already checked in to', ssid)
    }
    
    lastSsid = ssid
    var checkinUrl = "https://api.foursquare.com/v2/checkins/add?oauth_token=" + token + "&venueId=" + fsqid + "&v=" + dateStamp()
    
    console.log("Checking in at", ssid, checkinUrl)
    
    request.post(checkinUrl, function(err, resp, body) {
      if (err || resp.statusCode > 299) console.error(err || body)
      else console.log('Checked in at', JSON.parse(body).response.checkin.venue.name)
      wait()
    })
  }
}

function dateStamp() {
  var d = new Date()
  var year = d.getFullYear() + '';
  var day = twoPad(d.getDate()) + '';
  var month = twoPad(d.getMonth() + 1) + '';
  return year + day + month
}

function twoPad(n) {
  return n < 10 ? '0' + n : n;
}
