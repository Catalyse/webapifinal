var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require("dotenv").config();

var router = require('./routes/router');
var request = require('./routes/request');
var user = require('./routes/user');
var charity = require('./routes/user');
var product = require('./routes/user');
var cart = require('./routes/user');
var transaction = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('123'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
app.use('/r/', request);
app.use('/r/user', user);
app.use('/r/charity', charity);
app.use('/r/product', product);
app.use('/r/cart', cart);
app.use('/r/transaction', transaction);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.send('Invalid Route and/or Method');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).send(err.message);
});

module.exports = app;
