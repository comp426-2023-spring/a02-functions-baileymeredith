#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));
// const help_message = `Usage: ./galo.sh [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n  -h            Show this help message and exit.\n  -n, -s        Latitude: N positive; S negative.\n  -e, -w        Longitude: E positive; W negative.\n  -z            Time zone: uses /etc/timezone by default.\n  -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n  -v            Verbose output: returns full weather forecast.\n  -j            Echo pretty JSON from open-meteo API and exit.`
const days = args.d
const timezone = setTimeZone();
const latitude = setLatitude();
const longitude = setLongitude();

if (args.h) {
    // displays the help message
       console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n',
       '    -h            Show this help message and exit.\n',
       '    -n, -s        Latitude: N positive; S negative.\n',
       '    -e, -w        Longitude: E positive; W negative.\n',
       '    -z            Time zone: uses tz.guess() from moment-timezone by default.\n',
       '    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n',
       '    -j            Echo pretty JSON from open-meteo API and exit.\n')
       process.exit(0)
    }

// the following functions initialize the parameters to be used in the API URL
function setTimeZone() {
    if (args.z != null) {
        return args.z
    } else {
        return moment.tz.guess();
    }
}
function setLatitude() {
    let lat
    if (args.n != null) {
        lat = args.n
    } else {
        lat = args.z * -1
    }
    lat = lat.toFixed(2)
    return lat
}
function setLongitude() {
    let long 
    if (args.e != null) {
        long = args.e 
    } else {
        long = args.w * -1
    }
    long = long.toFixed(2)
    return long
}

// make API call and assign the JSON associated with it to data
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&timezone=' + timezone);
const data = await response.json();

if (args.j) {
    // logs JSON
    console.log(data)
    process.exit(0)
}

// retrieves how many hours it will rain for a particular day
// and writes message accordingly
const precip = data.daily.precipitation_hours[days]

if (precip != 0) {
    process.stdout.write("You might need your galoshes ")
} else {
    process.stdout.write("You will not need your galoshes ")
}

if (days == 0) {
    process.stdout.write("today.")
  } else if (days > 1) {
    process.stdout.write("in " + days + " days.")
  } else {
    process.stdout.write("tomorrow.")
  }
