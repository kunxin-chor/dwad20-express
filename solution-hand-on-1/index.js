const express = require('express');

let app = express();

// req - request (whatever the browser/client has sent to the server)
// res - response (whatever the server will send back)
app.get("/", function(req,res){
  res.send("Hello world");
});

app.get("/color/:desiredColor", function(req, res){
    let desiredColor = req.params.desiredColor;
    res.send(desiredColor.toUpperCase());
})

app.listen(3000, function(){
  console.log("Server has started")
});