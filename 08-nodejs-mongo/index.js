// require in the MongoClient
// allows us to connect a Node program to a Mongo Database

const MongoClient = require("mongodb").MongoClient;
require('dotenv').config(); // <-- look for the .env file in the same directory and process it
// whatever variables we define in .env file will be added to `process.env` object

// process.env is an object that is automatically available
// to all nodejs programs. `process` reperesents the
// operating system, and .env is the enviornment
// the enviornment contain variables
console.log(process.env);


async function main() {
    let url = process.env.MONGO_URI;
    // the MongoClient allows us to issue commands to the mongo database
    let client = await MongoClient.connect(url, {
        useUnifiedTopology: true
    })
    // select which database we want
    let db = client.db("sample_airbnb");
    console.log("database connected");
    let listings = await db.collection("listingsAndReviews").find().limit(10).toArray();
    console.log(listings);
}
main();