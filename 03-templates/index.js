const express = require('express');

// 1. SETUP
let app = express();

// SET THE VIEW ENGINE (aka. the template engine)
app.set('view engine', 'hbs');  // <-- tell Express we are using handlebars as the view engine

// 2. ROUTES
app.get("/", function(req,res){
    // tells Express to take the content of 'index.hbs'
    // and send it back as HTML
    // the first parameter is the name of the hbs file
    // (the extension is optional)
    // the path is ALWAYS relative to the /views folder
    res.render('index.hbs');
})

app.get('/greeting/:firstname/:lastname', function(req,res){
    let firstName = req.params.firstname;
    let lastName = req.params.lastname;

    // the second parameter for the render function
    // the keys are the placeholders in the .hbs file
    // the values are the content of the placeholder
    res.render("greet", {
        "firstName": firstName,
        "lastName": lastName
    })
})

// 3. LISTEN
app.listen(3000, function(){
    console.log("Server has began");
})