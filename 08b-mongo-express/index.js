const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express();

app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// allows our express application to process forms
app.use(express.urlencoded({
    'extended': false
}));

// ROUTES
app.get('/', function(req,res){
    res.send("Hello world")
})

app.listen(3000, function(){
    console.log("Server has started")
})