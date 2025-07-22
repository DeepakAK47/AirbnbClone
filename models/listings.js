const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    riview :[
        {
            type : Schema.Types.ObjectId,
            ref : "Riview",
        },
    ],
});

// Creating model name Listing
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;