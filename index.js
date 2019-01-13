var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");

//Routes refactored
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

//seedDB();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect('mongodb://root:1mFX!B4FEO6H@ds255754.mlab.com:55754/yelpcamp');

//Passport configuration
app.use(require("express-session")({
  secret: "AsiaAsiaEmilEmil",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Error: listen EACCES: permission denied 0.0.0.0:80
var server = require('http').createServer();
var port = process.env.PORT || 3000;

app.listen(port, server, function () {
  console.log("The YelpCam Server has started!");
});