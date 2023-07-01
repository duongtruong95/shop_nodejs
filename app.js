var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var cate = require('./routes/cate');
var product = require('./routes/product');
var User = require('./model/User.js');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var app = express();
var bcrypt = require('bcrypt');

//var upload = multer({ dest: '/public/uploads/' })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://127.0.0.1:27017/dbtest').then(function () {
  console.log('Connect database successfully!')
});

async function fakeDataAdmin() {
  try {
    const result = await User.findOne({ email: 'admin@gmail.com' }).exec();
    if (!result) {
      const user = new User({
        fullname: 'Admin',
        img: null,
        email: 'admin@gmail.com',
        password: 'admin123',
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      console.log('Fake data admin successfully!');
    }
  } catch (err) {
    console.error(err);
  }
}

fakeDataAdmin();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({ secret: 'prjnodejs', resave: true, saveUninitialized: true }))


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(session({
  secret: 'prjnodejs',
  resave: true,
  key: 'user',
  saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});





app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/admin/cate', cate);
app.use('/admin/product', product);

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
