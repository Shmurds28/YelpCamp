var express = require("express");
var router = express.Router();
const cloudinary = require('cloudinary');
const multer = require("multer");
var campground = require("../models/campground");
var middleware = require("../middleware");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser =require("body-parser");
const upload = require("../middleware/upload");
 
// var imgModel = require('./models/image'); 

var fs = require('fs'); 
 require('dotenv/config'); 

 router.use(bodyParser.urlencoded({ extended: false })) ;
 router.use(bodyParser.json()) ;

mongoose.connect("mongodb://localhost/yelp_camp", 
    { useNewUrlParser: true, useUnifiedTopology: true }, err => { 
        console.log('connected') ;
    }); 

    


//upload single file
const uploadFile = async (req, res, next) => {
  try {
    await upload.uploadFilesMiddleware(req, res);

    // console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

//INDEX- Show all Campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    campground.find({}, function(err, allcampgrounds){
         if(err){
             console.log(err);
         }else{
             res.render("campgrounds/index", {campgrounds:allcampgrounds});
         }
    });
 
 });

 //CREATE- Add new Campground to the DB
router.post("/", middleware.isLoggedIn, uploadFile, function(req, res){
    var name = req.body.name;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    } 
    console.log(req.file);
    var image = { 
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
        contentType: 'image/png'
    }
   
    var newCampground = {name: name, price: price, description:desc, author: author, image: image};

  
    //Create new campgrounds and add to the database
     campground.create(newCampground, function(err, newlyCreated){
         if(err){
             console.log(err);
         }else{
             //redirect back to campgrounds page
             res.redirect("/campgrounds");
         }
     })
 
 });
 //NEW- Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
     res.render("campgrounds/new");
 });

 //SHOW- shows more info about one campground
router.get("/:id", function(req, res){
     //find campround with provided ID
     campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
         if(err){
             console.log(err);
         }else{
            //  console.log(foundCampground);
             //render show template with that campground
             res.render("campgrounds/show", {campground:foundCampground});
         }
     });
 });

 //EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});  
        });
});

 //UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, uploadFile, function(req, res){
    //find and update correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            updatedCampground.image = { 
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
                contentType: 'image/png'
            };
            updatedCampground.save();
            res.redirect("/campgrounds/" + req.params.id);
        }  
    });
    //redirect to show page
}); 

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


 module.exports = router;
 