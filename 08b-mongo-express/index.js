const express = require('express');
const hbs = require('hbs');

// setup the 189 handlebar helpers
const helpers = require("handlebars-helpers")({
    'handlebars': hbs.handlebars
})

// to use ObjectId
const { ObjectId } = require('mongodb');

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

const COLLECTION = "food_records";

async function main() {

    // before we set up the routes, we connect to the database
    const url = process.env.MONGO_URI;
    await MongoUtil.connect(url, "dwad20_food_cico");
    console.log("Connected to the database");

    app.get('/asd', function(req, res){
        res.render("asd",{
            'foobar': 42,
            'firstName':'John'
        })
    })

    // ROUTES
    app.get('/', async function(req,res){
        let db = MongoUtil.getDB();
        let foodRecords = await db.collection(COLLECTION).find({

        }).toArray();  // if we use .find, we need to convert the result value to array before we can use it

        console.log(foodRecords);

        res.render('all-food',{
            "foodRecords": foodRecords
        })
    })

    app.get('/add-food', function(req,res){
        res.render('add-food')
    })

    app.get('/food/:food_id/add-note', async function(req,res){
        let foodRecord = await MongoUtil.getDB().collection(COLLECTION).findOne({
            _id:ObjectId(req.params.food_id)
        });

        res.render('add-note',{
            'foodRecord': foodRecord
        })
    })

    app.post('/food/:food_id/add-note', async function(req,res){
        // we want to add a new sub-document (aka embedded document)
        // to the document with the matching food_id
        let db = MongoUtil.getDB();

        let newNote = {
            "_id": ObjectId(),  // we need to provide the _id manually for sub-documents
            "content": req.body.content
        }

        // we are updating the existing document to ADD a new embedded document
        // so we use updateOne instead of insertOne
        db.collection(COLLECTION).updateOne({
            "_id":ObjectId(req.params.food_id)
        },{
            "$push":{
                'notes':newNote  // push the sub document into the array
            }
        })

        res.redirect('/food/'+req.params.food_id)

    } )

    app.get('/food/:food_id', async function(req,res){
        let foodRecord = await MongoUtil.getDB().collection(COLLECTION).findOne({
            _id:ObjectId(req.params.food_id)
        });

        res.render('food-details',{
            "foodRecord": foodRecord
        })
    })


    app.get('/food/:food_id/update-note/:note_id', async function(req,res){
        // we need get the document and the sub-document
        let db = MongoUtil.getDB();
        // store the note_id parameter into the noteId variable
        let noteId = req.params.note_id;
        let foodRecord = await db.collection(COLLECTION).findOne({
            _id:ObjectId(req.params.food_id)
        },{
           
            'projection':{
                'foodRecordName':1,
                 // only show the element from the notes array where its _id matches
                // the one in the noteId variable
                'notes':{
                   "$elemMatch":{
                    "_id":ObjectId(noteId)
                   }
                }
            }
        });
        
        res.render('update-note',{
            'foodRecord': foodRecord
        })
    })

    app.post('/food/:food_id/update-note/:note_id', async function(req,res){
    
        await MongoUtil.getDB().collection(COLLECTION)
            .updateOne({
                "_id": ObjectId(req.params.food_id),
                "notes._id": ObjectId(req.params.note_id)
            },{
                '$set':{
                    'notes.$.content': req.body.content
                }
            })
        res.redirect('/food/' + req.params.food_id);
    })

    app.get('/food/:food_id/delete-note/:note_id', async function(req,res){
        await MongoUtil.getDB().collection(COLLECTION)
            .updateOne({
                "_id": ObjectId(req.params.food_id),
            },{
                "$pull":{
                    'notes':{
                        "_id": ObjectId(req.params.note_id)
                    }
                }
            })

            res.redirect('/food/' + req.params.food_id);
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
        db.collection(COLLECTION).insertOne({
            "foodRecordName": foodRecordName,
            "calories": calories,
            "tags": tags
        })

        // redirect to the '/' to display all the food
        res.redirect('/');

    })

    // we use the `food_id` url parameter to indicate the ID
    // of the food record document that we want to update
    // so if the user goes to "/update-food/123", then the 
    // `food_id` parameter will be 123
    app.get('/update-food/:food_id', async function(req,res){
       // find the food record
       let db = MongoUtil.getDB();


       // we use findOne instead of find when we only want one result
       // or when we know there will only be one result.
       // remember to use ObjectId function when getting
       // a document by its _id
       let foodRecord =  await db.collection("food_records").findOne({
          _id: ObjectId(req.params.food_id)
       })

       console.log(foodRecord);

       res.render('update-food',{
        // pass the document stored in foodRecord to the hbs as file as the placeholder 'foodRecord'
        'foodRecord': foodRecord
       })


    })

    app.post('/update-food/:food_id', async function(req,res){

        // read all the values from the form
        let { foodRecordName, calories, tags} = req.body;
        // eqv to the lines below 
        // let foodRecordName = req.body.foodRecordName;
        // let calories = req.body.calories;
        // let tags = req.body.tags;

        if (!tags) {
            tags = [];
        } else if (!Array.isArray(tags)) {
            // if tags is not an array and not undefined
            // then it is a string and we convert it to an
            // array with that string as its only element
            tags = [ tags ];
        }

        // find the document that we want to update
        await MongoUtil.getDB().collection(COLLECTION).updateOne({
            _id:ObjectId(req.params.food_id)
        },{
            // replace each key in the document with the value read in from the form
            "$set": {
                "foodRecordName": foodRecordName,
                "calories": calories,
                "tags": tags
            }
        })   

        res.redirect('/')

    })

    app.get('/delete-food/:food_id', async function(req,res){
        let db = MongoUtil.getDB();
        let foodRecord = await db.collection(COLLECTION).findOne({
            "_id": ObjectId(req.params.food_id)
        });
        console.log(foodRecord);
        res.render('delete-food',{
            'foodRecord': foodRecord
        })
    })

    app.post('/delete-food/:food_id', async function(req,res){
        let db = MongoUtil.getDB();
        await db.collection(COLLECTION).deleteOne({
            "_id":ObjectId(req.params.food_id)
        })

        res.redirect('/');
    })
}
main();



app.listen(3000, function(){
    console.log("Server has started")
})