var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
LocalStrategy = require("passport-local");
var campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");
var methodOverride = require("method-override");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

 mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/yelp_camp");
//mongoose.connect("mongodb+srv://Simamkele:<simamkele$2000>@yelpcamp.krbsg.mongodb.net/<yelpcamp>?retryWrites=true&w=majority");

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
});

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static("Images"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again, Rusty wins cutest dog!",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//requiring routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(process.env.PORT || "6000", function(){
    console.log("Yelp camp has started");
});