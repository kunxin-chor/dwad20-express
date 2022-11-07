const MongoClient = require("mongodb").MongoClient;

let _db = null; // global _db variable to remember which database we are using

// the first argument of the connect
// function is the connection string of the database
async function connect(url, databaseName){
    let client = await MongoClient.connect(url, {
        useUnifiedTopology:true
    })
    // set the selected database
    _db = client.db(databaseName);
}

function getDB() {
    return _db;
}

// share the connect and getDB functions with other JS files
module.exports = { connect, getDB}