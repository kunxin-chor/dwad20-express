const express = require('express');  // require only works in nodejs

// 1. create application
const app = express();


// 2. define the routes
app.get("/", function (req, res) {
    res.send("<h1>Hello everybody</h1>");
})

// if the user type in "pokemon/pikachu", then "pokemonName" will be "pikachu"
// the : marks a route parameter
app.get("/pokemon/:pokemonName", function (req, res) {
    let pokemon = req.params.pokemonName;  // req.params will have all the ROUTE PARAMETERS
    // if we want pokemonName parameter, we use req.params.pokemonName

    res.send("You are looking for " + pokemon);
})

app.get("/addTwo/:number1/:number2", function(req,res){
    // any data from the parameters will be a STRING
    let number1 = parseInt(req.params.number1);
    let number2 = parseInt(req.params.number2);
    let sum = number1 + number2;
    res.send("Sum = " + sum);
})

// 3. begin the server
app.listen(3000, function () {
    // this function will be called once the server is ready
    console.log("server has started");

})