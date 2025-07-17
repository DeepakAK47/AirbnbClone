const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");  // Be carefull use single dot if it is outside only one directory.


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



// Setting our API's
app.get("/", (req,res)=>{
    res.send("Deepak is working on the Airbnb clone project");  // It is lsiteing at when call it at localhost:8080
});


// Setting API for testing listing
app.get("/testListing", async (req,res)=>{
let sampleListing = new Listing({
    tittle : "my Villa",
    description : "I is too much beatiful",
    image : "https://unsplash.com/s/photos/hotel",
    price : 1200,
    location : "Goa",
    country : "India", 
});
await sampleListing.save();
console.log("sample was saved");
res.send("successful testing is done");
});


// It is used for running the server
app.listen(8080,()=>{
    console.log("App is listening on the port of 8080");  // It is used for starting the server.
});
