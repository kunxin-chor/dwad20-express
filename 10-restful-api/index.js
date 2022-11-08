
const express = require('express');
const cors = require('cors');

// new setup to do
require('dotenv').config();  // process our .env file
const MongoUtil = require('./MongoUtil'); // our own module, make sure to use ./ in front
const { ObjectId } = require('mongodb');

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
    app.get('/', function (req, res) {
        res.send("hello world");
    })

    // endpoint to allow clients to add in a new food sighting
    // the client must provide the following key/value pairs
    // - description: string
    // - food: array of strings
    // - datetime: iso date format
    app.post('/food-sightings', async function (req, res) {

        try {
            let description = req.body.description;
            let food = req.body.food;

            // handle cases where description or food is falsely
            if (!description || !food) {
                // they don't end the route function
                res.status(400);
                res.json({
                    'error':'Food and description must be filled in'
                })
                return; // we must explictly return because a route
                        // can perform res.json, res.render or res.send once
            }

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
        } catch (e) {
            console.log(e);
            res.status(500);
        }

    })

    // we use the HTTP 'get' verb for any endpoints that retrieve data
    app.get('/food-sightings', async function (req, res) {

        console.log(req.query);

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

    app.put('/food-sightings/:sighting_id', async function(req,res){
        try {

            let {description, food} = req.body;
            let datetime = new Date(req.body.datetime) || new Date();

            // let modifiedDocument = {
            //     "description": description,
            //     "food": food,
            //     "datetime": datetime
            // }
            // we can use the following shortcut if the key name is the same as the variable name
            let modifiedDocument = {
                description, food, datetime
            }

            const result = await MongoUtil.getDB().collection('sightings')
                .updateOne({
                    "_id":ObjectId(req.params.sighting_id)
                },{
                    '$set': modifiedDocument
                });

            res.status(200);
            res.json({
                'message':'Update success'
            });

        } catch (e) {
            res.status(500);
            res.send(e);
            console.log(e);

        }
    })

    app.delete('/food-sightings/:sighting_id', async function(req,res){
        try {
            await MongoUtil.getDB().collection('sightings').deleteOne({
                "_id": ObjectId(req.params.sighting_id)
            })

            res.status(200);
            res.json({
                'message':"Food sighting has been deleted"
            })

        } catch (e) {
            res.status(500);
            res.json({
                "error": e
            });
            console.log(e);
        }
    })


}
main();
// begin listening to server
app.listen(3000, function () {
    console.log("Server has started")
})