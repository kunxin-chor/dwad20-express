const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

// require in the MongoUtil module.
// whatever we export in MongoUtil.js is available in the MongoUtil variable
const MongoUtil = require("./MongoUtil");

// read in the MONGO_URI variable from the '.env' file
require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// allows our express application to process forms
app.use(express.urlencoded({
    'extended': false
}));

async function main() {

    // before we set up the routes, we connect to the database
    const url = process.env.MONGO_URI;
    await MongoUtil.connect(url, "dwad20_food_cico");
    console.log("Connected to the database");

    // ROUTES
    app.get('/', async function(req,res){
        let db = MongoUtil.getDB();
        let foodRecords = await db.collection('food_records').find({

        }).toArray();
        res.render('all-food',{
            "foodRecords": foodRecords
        })
    })

    app.get('/add-food', function(req,res){
        res.render('add-food')
    })

    app.post('/add-food', function(req,res){
        // the data of the form is inside `req.body`
        // let foodRecordName = req.body.foodRecordName;
        // let calories = req.body.calories;
        // let tags = req.body.tags;

        // using 'destructuring' to extract the foodRecordName, calories and tags
        // from the req.body object
        let {foodRecordName, calories, tags} = req.body;

        // since tags is based on checkboxes, we need to check
        // whether it is a single string, an array of string or falsely value
        if (!tags) {
            tags = [];
        } else {
            if (!Array.isArray(tags)) {
                tags = [ tags ];
            }
        }

        
        // get our database
        let db = MongoUtil.getDB();

        // the insertOne function allows us to add a record to 
        // a collection in the database
        db.collection("food_records").insertOne({
            "foodRecordName": foodRecordName,
            "calories": calories,
            "tags": tags
        })

        // redirect to the '/' to display all the food
        res.redirect('/');

    })
}
main();



app.listen(3000, function(){
    console.log("Server has started")
})