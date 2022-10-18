const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');



// create the express application
let app = express();

// setup the hbs templates
app.set('view engine', 'hbs');

// wax-on for template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// create our custom helper
// use the registerHelper function from the handlebars
// to create our custom helper
// first parameter is the name of our custom helper
// second parameter is a callback function that is called
// whenever the helper is used
hbs.handlebars.registerHelper("ifEquals", function(arg1, arg2, options){
    if (arg1 == arg2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
})

// root route
app.get('/', function(req,res){
    res.render("index"); // the extension .hbs is optional 
})

app.get('/luckyNumber', function(req,res){
    let luckyNumber = Math.floor(Math.random() * 100) + 1;
    let unluckyNumber = Math.floor(Math.random() * 100) + 1;
    res.render("lucky",{
        // the key refers to the placeholder in the hbs file
        // the value will be whatever is subsituted into the placeholder
        'luckyNumber': luckyNumber,
        'unluckyNumber': unluckyNumber
    })
})

app.get('/fruits', function(req,res){
    let fruits = ["apples", "bananas", "cherries", "oranges"];
    res.render("fruits",{
        "fruits": fruits
    })
})

app.get("/favorite_fruits/:fruit", function(req,res){
    // in hbs file,if the fruit is "apples"
    // we want to print "Yea the doctors are keep away from you"
    let favoriteFruit = req.params.fruit;
    res.render('favorite', {
        'fruit': favoriteFruit
    })
})

// the route URL allows for one ROUTE PARAMETER
// so it will match: '/check_if_even/2' or '/check_if_even/7'
app.get("/check_if_even/:number", function(req,res){
    let number = req.params.number;
    let isEven = false;
    if (number % 2  == 0) {
        isEven = true
    }
    res.render('isEven',{
        'number': number,
        'isEven': isEven
    })  
})

// listen at port 3000
app.listen(3000, function(){
    console.log("Server has began")
})