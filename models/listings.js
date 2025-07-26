const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =  require("./review.js");

// Creating Schema

const listingSchema = new Schema({
    title:{
        type : String,
        require : true,
    },
    description : {
        type : String,
    },
    image:{
        filename : String,
        url : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner :{
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});

// It is used to delete the data of the review from the mongodb when we delete or particular listing.
listingSchema.post("findOneAndDelete",async function(deletedListing){
if(deletedListing){
    await Review.deleteMany({
        _id : {$in: deletedListing.reviews}
    });
};
});

// creting post for the delete all the reviews when we delete a particular listing.


// Creating model name Listing
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
