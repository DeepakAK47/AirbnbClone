const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");  // Be carefull use single dot if it is outside only one directory.
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate"); 


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

// Index Route
app.get("/listings", async(req,res)=>{
const allListings = await Listing.find({});
res.render("listings/index.ejs",{allListings});
});

// New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs"); 
}); 

// Show Route

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
const listing = await Listing.findById(id);
res.render("listings/show.ejs",{listing});
})

// Create Route
app.post("/listings", async(req,res)=>{
    console.log(req.body);
const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
});


// Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
let {id} = req.params;
const listing = await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
});


// update Route
app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});

// Delete Route

app.delete("/listings/:id",async(req,res)=>{
let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
});



// It is used for running the server
app.listen(8080,()=>{
    console.log("App is listening on the port of 8080");  // It is used for starting the server.
});
