var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var router = require('./routes/index');

var app = express();
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
// view engine setup
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .use(cookieParser())
   .use(express.static(path.join(__dirname, 'public')))
   .use('/',router)
    .listen(3348);

module.exports = app;
