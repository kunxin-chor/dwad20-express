
const express = require('express');
const cors = require('cors');

// new setup to do
require('dotenv').config();  // process our .env file
const MongoUtil = require('./MongoUtil'); // our own module, make sure to use ./ in front

// we can only access the process.env.MONGO_URI after we require 'dotenv'
const MONGO_URI = process.env.MONGO_URI;

// createt the express app
const app = express();


// !! ENABLE JSON PROCESSING
// restful API communicates via the JSON format. Meaning:
// when we send data to the restful API, we uses JSON
// and their response is also in JSON
app.use(express.json());

// !! ENABLE CROSS ORIGIN RESOURCES SHARING
app.use(cors());

async function main() {
    await MongoUtil.connect(MONGO_URI, "dwad20_food_sightings");
    console.log("Database connected");
    app.get('/', function(req,res){
        res.send("hello world");
    })

    // endpoint to allow clients to add in a new food sighting
    // the client must provide the following key/value pairs
    // - description: string
    // - food: array of strings
    // - datetime: iso date format
    app.post('/food-sightings', async function(req,res){
        let description = req.body.description;
        let food = req.body.food;

        // if req.body.datetime is in the valid date time format (YYYY-MM-DD),
        // then new Date(req.body.datetime) will be a truthly value otherwise
        // it will be a falsy value. If it is a falsy value, then we
        // use today's date instead (via new Date())
        let datetime = new Date(req.body.datetime) || new Date();

        let foodSighting = {
            "description": description,
            "food": food,
            "datetime": datetime
        }

        const db = MongoUtil.getDB();
        const result = await db.collection("sightings").insertOne(foodSighting);
        res.status(200);  // set the status to 200, meaning "OK"
        res.send(result);
    })

    // we use the HTTP 'get' verb for any endpoints that retrieve data
    app.get('/food-sightings', async function(req,res){

        // query string are retrieved using req.query
        // console.log(req.query);

        // to build a search engine, we an empty criteria object (that means we want all the documents)
        let criteria = {};

        // if the user specifies to search by description, then we add the description to the criteria
        if (req.query.description) {
            // adding the 'description' key to the criteria object and assign req.query.description
            // as the value
            criteria['description'] = {
                "$regex": req.query.description,  // use regex expression search
                "$options": "i"  // ignore case
            }
        }

        if (req.query.food) {
            criteria['food'] = {
                "$in": [req.query.food]
            }
        }

        console.log(criteria);

        let results = await MongoUtil.getDB().collection("sightings").find(criteria).toArray();

        res.status(200);
        res.json(results);  // send the results back as JSON

    })


}
main();
// begin listening to server
app.listen(3000, function(){
    console.log("Server has started")
})