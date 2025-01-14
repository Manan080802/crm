var createError = require('http-errors');
var express = require('express');
var path = require('path');
const exphbs = require('express-handlebars')
var cookieParser = require('cookie-parser');
var session = require('express-session')
var flash = require('connect-flash');

var logger = require('morgan');
require("./database/connection.js")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var customerRouter = require("./routes/customer")
var adminRouter = require('./routes/admin.js')
const {auth} = require("./controller/auth.js");


var app = express();
const hbs = exphbs.create(require("./helper/handlebars.js"))
// view engine setup
app.engine('hbs',hbs.engine)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
auth(app)
// auth1(app)
app.use(flash());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/customer',customerRouter)
app.use('/users', usersRouter);
app.use('/admin',adminRouter)

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
