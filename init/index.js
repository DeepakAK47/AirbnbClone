const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
const initData = require("./data.js");

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

const initDB = async () =>{
    await Listing.deleteMany({});  // It is responsible for deleting the initial data inside the mongo shell
    // Convert any single `image` field in the sample data into an `images` array
    initData.data  =  initData.data.map((obj)=>({
        ...obj,
        owner : '6884ca1750f36d9cfb7ed003',
        images: obj.images && obj.images.length ? obj.images : (obj.image ? [obj.image] : []),
    }));
    // Remove legacy `image` field from objects to avoid duplication in DB documents
    initData.data = initData.data.map(o => {
        const { image, ...rest } = o;
        return rest;
    });
    await Listing.insertMany(initData.data);  // It is respnsible for saving data in the mongo shell.
    console.log("Your data is saved successfully inside the mongo shell");
}
initDB();