const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');


let app = express(); //create the express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as the view engine
waxOn.on(hbs.handlebars); // enable wax-on for handlebars (for template inheritance)
waxOn.setLayoutPath('./views/layouts') // inform wax-on where to find the layouts

// By default Express does not support forms
// so we have to manually enable form processing
app.use(express.urlencoded({
    'extended':false // for processing HTML forms usually it's false because
                     // HTML forms are usually quite simple
}))

// routes
app.get('/', function(req,res){
    res.send("hello world")
})

app.get('/add_food', function(req,res){
    res.render("add_food")
})

app.post('/add_food', function(req,res){
    console.log("req.body =", req.body);
    let foodName = req.body.foodName;
    let calories = req.body.calories;
    let meal = req.body.meal;
  
    // three possible cases: 
    // 1. req.body.tags is an array (if the user select multiple)
    // 2. req.body.tags is a single string (if the user select one)
    // 3. req.body.tags is undefined (if the user selects none)
    let selectedTags = null;  // set to null we are not clear what it will store
    
    // undefined is falsely value
    if (req.body.tags) {
        if (Array.isArray(req.body.tags)) {
            // if req.body.tags is already an array, then we just store
            // the reference to the array ins selectedTags
            selectedTags = req.body.tags;
        } else {
            // if req.body.tags is a single string, we convert it to an array
            // if req.body.tags is "vegan"
            selectedTags = [ req.body.tags ]
            // => selectedTags = [ "vegan" ]
        }

    } else {
        // if req.body.tags is undefined, we will set selectedTags to be an empty array
        selectedTags = [];
    }
    res.render("food_summary",{
        foodName: foodName,
        calories: calories,
        meal: meal,
        tags: selectedTags
    })
})


app.listen(3000, function(){
    console.log("server started");
})