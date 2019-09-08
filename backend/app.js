var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var async  = require('express-async-await')
var fetch = require('node-fetch');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')
const promxityData = require('./apis/proximity_cache');

const MapsPlacesApiHandler = require('./apis/places');
const MapsDirectionsApiHandler = require('./apis/directions');

const placesApi = new MapsPlacesApiHandler();
const directionsApi = new MapsDirectionsApiHandler();

var app = express();
app.use(cors())

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/home', function(req, res) {
  res.send('hello govhack?? why');
});

app.get('/wtf', function(req, res) {
  res.send('wtf govhack');
});

// APIS!!!! -------------
app.get('/places/:string', async function(req, res) {
  const query = req.params.string
  console.log(`places/:string = ${query}`);
  const apiResponse = await placesApi.queryForLocation(query);
  res.send(apiResponse);
});

function proximityParser(srcId, destId) {
  console.log(`proximityParser(${srcId})`);
  const locations = Object.keys(promxityData);
  const nearByIds = []
  locations.map(key => {
    const metadata = promxityData[key];
    // console.log(metadata);
    let candiateWaypointIds = [];
    if ((metadata['placeId'] === srcId) || (metadata['placeId'] === destId) ) {
      const candiateWaypoints = metadata['near']
      console.log('checking waypoints');
      candiateWaypoints.map(name => {
        console.log(name);
        console.log(promxityData[name]['placeId'])//['placeId']});
        if ((promxityData[name]['placeId'] !== destId) && (promxityData[name]['placeId'] !== srcId)) {
          // no cycles.
          nearByIds.push(promxityData[name]['placeId']);
        }
      });
    }
  })
  console.log('near by ids')
  console.log(nearByIds);
  return nearByIds;
  ;
}

// proximityParser("ChIJV8d5QB-uEmsRi9BCpTXUWFI", "ChIJN1t_tDeuEmsRUsoyG83frY4");

// http://localhost:8888/directions/a&b
app.get('/directions/:srcPlaceId&:destPlaceId', async function(req, res) {
  const {srcPlaceId, destPlaceId}  = req.params;
  console.log(req.params)
  console.log(`directions/:srcId=${srcPlaceId}/:destId=${destPlaceId}`);
  const apiResponse = await directionsApi.queryForDirections(srcPlaceId, destPlaceId);
  console.log(apiResponse['routes'].length)
  console.log('num routes above');
  if (apiResponse["routes"].length < 3) {
    if (apiResponse["routes"].length !== 0) { 
      console.log('getting more routes!');
      const waypoints = proximityParser(srcPlaceId, destPlaceId);
      const alt1SampleStart = await directionsApi.queryForDirections(srcPlaceId, destPlaceId, true, waypoints[0]);
      const alt2SampleEnd =  await directionsApi.queryForDirections(srcPlaceId, destPlaceId, true, waypoints[waypoints.length - 1]);
      // Fist one is most reccomended but also worst.
      // might err but yolo
      apiResponse["routes"].push(alt1SampleStart["routes"][0]);
      apiResponse["routes"].push(alt2SampleEnd["routes"][0]);
     };
    
}
  // if num routes < 3.
  // generate 3 more.
  // get nearby place.
  // use as way point.
  res.send(apiResponse);
});
// APIS!!!! -------------


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
