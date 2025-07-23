const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");  // Be carefull use single dot if it is outside only one directory.
const path = require("path");
// Aquiring the wrapAsync function
const wrapAsync = require("./utils/wrapAsync.js");
// Aquiring AppError file

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate"); 

const Review = require("./models/review.js");


// It is the code for starting our server. 

const MONGO_URL = "mongodb://127.0.0.1:27017/Deepak";

main()
.then(()=>{
    console.log("Mongodb server is connected successfuly");
})
    .catch((err)=>{
        console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}



// Setting our API's Route
app.get("/", (req,res)=>{
    res.send("Deepak is working on the Airbnb clone project");  // It is lsiteing at when call it at localhost:8080
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Index Route  --> It is responsibe for the front page of the UI
app.get("/listings", wrapAsync(async(req,res,next)=>{
const allListings = await Listing.find({});
res.render("listings/index.ejs",{allListings});
}));

// New Route
app.get("/listings/new",wrapAsync(async(req,res,next)=>{
    res.render("listings/new.ejs"); 
})); 

// Show Route

app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
const listing = await Listing.findById(id).populate("reviews"); // here after using .populate  --> it will replace the ids to the full review documents.
res.render("listings/show.ejs",{listing});
}));

// Create Route
// Note -> Here next is a midddleware.
app.post("/listings", wrapAsync(async(req,res,next)=>{
    console.log(req.body);
const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
}));


// Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res,next)=>{
let {id} = req.params;
const listing = await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
}));


// update Route
app.put("/listings/:id", wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

// Delete Route

app.delete("/listings/:id",wrapAsync(async(req,res,next)=>{
let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
}));

// Delete Route for the review
app.delete("/listings/:id/reviews/:reviewId",async(req,res)=>{
    const {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews :reviewId }});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
});


// Riview form Route
app.post("/listings/:id/reviews", async(req,res)=>{
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
res.redirect(`/listings`);
});

// It is the route if the client sent the request to an invakid api
// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"Page not found!"));
// });

//   Route for the middleware --> This is responsible when you enter the wrong input in the any form like as string intead of the number.
app.use((err,req,res,next)=>{
    let {status = 500,message="Something went wrong!"}  = err;
    res.status(status).render("error.ejs",{err});
});


app.listen(8080,()=>{
    console.log("App is listening on the port of 8080");  // It is used for starting the server.
});
