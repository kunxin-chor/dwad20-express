const express = require('express');

let app = express();
    
// SET UP OUR VIEW ENGINE
app.set('view engine', 'hbs');

// ENABLE STATIC IMAGES
app.use(express.static("public"))

// SETUP WAX ON FOR TEMPLATE INHERITANCE
const hbs = require('hbs');
const wax = require('wax-on');

wax.on(hbs.handlebars); // apply wax-on to our version of handlebars
wax.setLayoutPath("./views/layouts"); // where to find the layout template
                                      // the layout define common elements shared across all hbs files

app.get("/", function(req,res){
    res.render('home');
})

app.get('/about-us', function(req,res){
    res.render('about-us')
})

app.get('/contact-us', function(req,res){
    res.render('contact')
})

app.listen(3000, function(){
    console.log("Server has started");
})