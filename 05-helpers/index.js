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

// root route
app.get('/', function(req,res){
    res.render("index"); // the extension .hbs is optional 
})

// listen at port 3000
app.listen(3000, function(){
    console.log("Server has began")
})