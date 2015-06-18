#!/usr/bin/env node

var request = require('request')
var cmd = require('child_process')
var fs = require('fs')
var hasInternet = require('hasinternet')

var token = process.argv[2] || process.env['FSQTOKEN'] || fs.readFileSync('token.txt')
var lastSsid = ""

console.log('Using token', token)
console.log('Using venues', fs.readFileSync('venues.json').toString())

checkin()

var checkinPeriod = 1000 * 60 * 60 * 12 // 12 hours

function wait() {
  var timeout = 1000 * 60 * 5
  console.log('Checking again in', timeout / 60 / 1000, 'minutes')
  setTimeout(checkin, timeout) // check every 5 minutes
}

function checkin() {
  hasInternet(function(err, online) {
    if (err || !online) {
      console.log('Not online')
      return wait()
    }
  
    var ssids = JSON.parse(fs.readFileSync('venues.json'))
  
    // OSX only
    var airport = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I" +
                  " | awk '/ SSID/ {print substr($0, index($0, $2))}'"
  
    cmd.exec(airport, done)
  
    function done(err, stdo, stde) {
      if (err) return console.log(err)
      var ssid = stdo.trim()
    
      var fsqid = ssids[ssid]
      if (!fsqid) {
        console.log('not in whitelist', ssid)
        return wait()
      }
      if (lastSsid === ssid) {
        console.log('Already checked in to', ssid)
        return wait()
      }
    
      lastSsid = ssid
    
      getLastCheckin()
    
      function getLastCheckin() {
        var myCheckins = "https://api.foursquare.com/v2/users/self/checkins?oauth_token=" + token + "&v=" + dateStamp()
        request(myCheckins, function(err, resp, body) {
          if (err || resp.statusCode > 299) {
            console.log('Error' + (err || body))
            return wait()
          }
          var lastCheckin = JSON.parse(body).response.checkins.items[0]
          if (lastCheckin && lastCheckin.venue.id === fsqid) {
            if (~~(Date.now()/1000) - (+lastCheckin.createdAt) > checkinPeriod) {
              doCheckin()
            } else {
              console.log('Already checked in recently to', ssid)
              return wait()
            }
          } else {
            doCheckin()
          }
        })
      }

      function doCheckin() {
        var checkinUrl = "https://api.foursquare.com/v2/checkins/add?oauth_token=" + token + "&venueId=" + fsqid + "&v=" + dateStamp()
        console.log("Checking in at", ssid, checkinUrl)
        request.post(checkinUrl, function(err, resp, body) {
          if (err || resp.statusCode > 299) {
            console.log('Error' + (err || body))
          } else {
            console.log('Checked in at', JSON.parse(body).response.checkin.venue.name)
          } 
          wait()
        })
      }
    }
  })
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
