const express = require('express');

let app = express();

app.set('view engine', 'hbs');

// the "forward slash URL" is also known as the ROOT url
// this is the route IF we just access the domain name
app.get('/', function(req,res){
 res.render('home')
})

app.get('/about-us', function(req,res){
    res.render('about-us')
})

app.get('/contact-us', function(req,res){
    res.render("contact-us");
})

app.listen(3000, function(){
    console.log("Server has stored")
})