var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var assert = require('assert');
var flash = require('express-flash');
var session = require('express-session');
var passport = require('passport');
var MongoDBStore = require('connect-mongodb-session')(session);
var hbs = require('express-handlebars');

var index = require('./routes/index');
var users = require('./routes/users');

var quoteGrab = require('./helpers/quoteGrabber');
var serverCode = require('./helpers/serverScript');

var Round = require('./models/typingRound');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({extname: '.hbs', defaultLayout: 'layout'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var url = process.env.MDB;

app.use(session({
    secret:'somethin',
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({ uri: url })
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect(url);

app.use('/', index);
app.use('/users', users);
app.use('./helpers/quoteGrabber', quoteGrab);

app.use('./models/typingRound', Round);

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
