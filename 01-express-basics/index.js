// 'require' has the idea of including
// out of the box, nodejs has no functionality for creating a server easily
// so express is a third-party package that adds the functionality
// for creating backend server easily.
// as it is a third party package, we have to explictly tell
// nodejs that we want use it, and the syntax `require (express)`
// the function will return an object that represent express
const express = require('express');

// the first argument of express is the NAME of the pacakge
// the return is an object that allows us to use the package
// the variable name that store the package is DOESN'T MATTER

// STEP 1. create an express application
const app = express();  // call the express function to create a new express application

// STEP 2. define some routes
app.get('/', function(req,res){
    res.send("Hello world");
});

app.get('/about-us', function(req,res){
    // 'req' stands for request
    // 'res' stands for response
    res.send("<h1>About Us</h1>");
})

// HTTP METHOD
// Get -- retrieve informations server
app.get('/lucky', function(req,res){
    let luckyNumber = parseInt(Math.random() * 100 + 1);
    res.send("Your lucky number is " + luckyNumber);
})

// STEP 3. Begin the server
// the first parameter is the PORT NUMBER that the server is activated on
// so if any requests come in at port 3000 for the server
// express will handle it
app.listen(3000, function(){
    console.log("Serve has started")
})