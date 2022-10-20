const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

// in-memory database
// the data are stored in the program's memory (the good news: easy to use, bad news: when the server is shut
// down all the data are gone)
// we are going to use a GLOBAL array. Since it is in a GLOBAL scope all our route functions
// are able to access it
let foodRecords = [
    {
        "id": 1001,
        "foodName": "Chicken Rice",
        "calories": 700,
        "meal":"lunch",
        "tags":["home-cooked"]
    },
    {
        "id": 1002,
        "foodName": "Boston Clam Chowder",
        "calories": 550,
        "meal":"dinner",
        "tags":["organic"]
    },
    {
        "id": 1003,
        "foodName": "Tuna Sandwich",
        "calories": 350,
        "meal":"breakfast",
        "tags":["gluten-free"]
    }
]; 


let app = express(); //create the express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as the view engine
waxOn.on(hbs.handlebars); // enable wax-on for handlebars (for template inheritance)
waxOn.setLayoutPath('./views/layouts') // inform wax-on where to find the layouts

app.use(express.urlencoded({
    'extended':false // for processing HTML forms usually it's false because
                     // HTML forms are usually quite simple
}))

// routes
app.get('/', function(req,res){
    res.send("hello world")
})

// R: read - the idea is to retrieve data from the database (i.e reading from the database)
// we will use a URL that matches the functionality of the route function
app.get('/all-food', function(req,res){
    let allFood = foodRecords;  // we simply just set allFood to be our global array
    res.render('all-food',{
        'allFood': allFood
    })
})

// Whether you are doing C: Create
// we need two routes: one to dispaly the form, one to process the form
app.get('/add-food', function(req,res){
    res.render('add-food')
})

app.post('/add-food', function(req,res){
    let foodName = req.body.foodName;
    let calories = req.body.calories;
    let meal = req.body.meal;

    let selectedTags = []; //assume that no tags is selected

    // test if req.body.tags is an array
    if (Array.isArray(req.body.tags)) {
        selectedTags = req.body.tags;
    } else if (req.body.tags) {
        // make req.body.tags is not falsely ()
        // if req.body.tags is not an array and is not fasley, therefore it's must be a string
        // we only get a string if the user only checked ONE checkbox
        selectedTags.push(req.body.tags); // add the checkbox's value to the array
    }

    let newFoodRecord = {
        id: Math.floor(Math.random() * 1000000 + 1), 
        foodName: foodName,
        calories: calories, 
        meal: meal,
        tags: selectedTags
    }

    // add the new food record into our global database
    foodRecords.push(newFoodRecord);

    // redirect: it tells the browser to go to a different URL
    // to display all the foods again, we redirect to the /all-food
    res.redirect("/all-food");

  
})

app.listen(3000, function(){
    console.log("server started");
})