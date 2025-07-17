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
    await Listing.insertMany(initData.data);
    console.log("Your data is saved duccessfully insed the mongo shell");
}
initDB();