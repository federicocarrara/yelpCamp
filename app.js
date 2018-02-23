var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    User = require('./models/user'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds'),
    methodOverride = require('method-override'),
    flash = require('connect-flash');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

//mongoose.connect('mongodb://localhost/yelp_camp_v12');
mongoose.connect('mongodb://Federico:pwd@ds147518.mlab.com:47518/yelpcamp');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(flash());

// seedDB(); // DROP DATABASES AND SEEDS

app.use(require("express-session")({
  secret: 'nobody should know',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Yelp camp server started"));
