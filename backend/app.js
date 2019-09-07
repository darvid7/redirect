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

const MapsPlacesApiHandler = require('./apis/places');
const placesApi = new MapsPlacesApiHandler();

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
  res.send('wtf');
});

app.get('/places/:string', async function(req, res) {
  const query = req.params.string
  console.log(`places/:string = ${query}`);
  const apiResponse = await placesApi.queryForLocation(query);
  res.send(apiResponse);
});

// ------------ APIS! ------------
// app.use('/', function(req, res) {
//   res.send('hello govhack');
// });
// ------------ APIS! ------------

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