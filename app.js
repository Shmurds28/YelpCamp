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
var path = require("path");
var crypto = require("crypto");
var multer = require('multer');
var GridfsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");


var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


var fs = require('fs'); 
 require('dotenv/config'); 

//  const conn = mongoose.connect( "mongodb://localhost/yelp_camp");
//  conn;
//mongoose.connect("mongodb+srv://Simamkele:<simamkele$2000>@yelpcamp.krbsg.mongodb.net/<yelpcamp>?retryWrites=true&w=majority");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/yelp_camp");


app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use(express.static("Images"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyparser.json());
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


app.listen( process.env.PORT || "1060", function(){
    console.log("Yelp camp has started");
});