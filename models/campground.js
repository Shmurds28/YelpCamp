var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   description: String,
   price: String,
   location: String,
   lat: Number,
   lng: Number,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   author: {
         id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         username: String
   },
   image: 
   { 
       data: Buffer, 
       contentType: String 
   }
});

module.exports = mongoose.model("Campground", campgroundSchema);
