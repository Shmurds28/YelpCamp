var express = require("express");
var router = express.Router({mergeParams:true});
var campground = require("../models/campground");
var Comment = require("../models/comment");
const comment = require("../models/comment");
var middleware = require("../middleware");

// ===========================
//  COMMENT ROUTES
// ============================

//NEW - Add new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground}); 
        }
    });
    
});

//COMMENTS CREATE
router.post("/new", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create({text: req.body.text}, function(err, comment){
            if(err){
                req.flash("error", "Something went wrong.");
                res.redirect('/campgrounds/' + campground._id);
                console.log(err);
            } else {
                // username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                // save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "successfully added comment.");
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
});

//EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
         res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
 });

//UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});





module.exports = router;
