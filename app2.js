var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
let stations = require('./routes/stations');
let getNearest = require('./routes/getNearest');


var app = express();

/////////////////////////////////////////////////////////////////////////////////////
// using togeojson in nodejs
// Storing KML file 
////////////////////////////////////////////////////////////////////////////////////

var toGeoJSON = require('togeojson'),
    fs = require('fs');
     //node doesn't have xml parsing or a dom. use xmldom
    DOMParser = require('xmldom').DOMParser;

var kml = new DOMParser().parseFromString(fs.readFileSync('substations.kml', 'utf8'));

var converted = toGeoJSON.kml(kml);

var convertedWithStyles = toGeoJSON.kml(kml, { styles: true });

converted["features"].forEach((station) => {
    var coordinate = station["geometry"].coordinates;
    var name = station["properties"].Name;
    console.log(`${coordinate} ${name}`);
});

///////////////////////////////////////////////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/stations', stations);
app.use('/getNearest', getNearest);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
