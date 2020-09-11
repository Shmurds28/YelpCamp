var express                 = require("express"),
     app                     = express(),
     bodyparser              = require("body-parser"),
     mongoose                = require("mongoose"),
     flash                   = require("connect-flash"),
     passport                = require("passport"),
    LocalStrategy               = require("passport-local"),
    seedDB                  = require("./seeds"),
    User                    = require("./models/user"),
    methodOverride          = require("method-override"),
    moment                  = require("moment"),
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

var fs = require('fs'); 
 require('dotenv/config'); 

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/yelp_camp");


app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use(express.static("Images"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyparser.json());
moment().format(); 
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

app.locals.moment = require('moment');

app.listen( process.env.PORT || "1060", function(){
    console.log("Yelp camp has started");
});