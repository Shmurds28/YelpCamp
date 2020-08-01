var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");
 

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
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    } 
    var newCampground = {name: name, price: price, image: image, description:desc, author: author};
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
             console.log(foundCampground);
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
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
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
 