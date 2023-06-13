var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');
const secretKey = 'login_pcb_hoangkhoi';
var app = express();
app.use(cookieParser());

// Cấu hình Passport.js
passport.use(new GoogleStrategy({
  clientID: '131248254514-hlq1m98l2dmo7lhag0f42ehljvo49nub.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Cấu hình session
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Khởi tạo Passport.js và sử dụng session
app.use(passport.initialize());
app.use(passport.session());


// Đăng nhập với tài khoản Google
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Xử lý phản hồi từ Google
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Nếu xác thực thành công, chuyển hướng đến trang chủ
    res.cookie('login', "login", { maxAge: 900000, httpOnly: true });
    res.redirect('/pcb/skill');
  }
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/pcb', require('./routes/pcb'));
app.use('/freelancer', require('./routes/freelancer'));
app.use('/projects', require('./routes/projects'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  //next(createError(404));
  res.status(404).send('what???');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
