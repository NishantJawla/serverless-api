const e = require('express');
const express = require('express');
const app = express();
const docClient = require('./aws')
app.get('/', (req, res) => {
    res.status(200).send("Hi Welcome to the API")
})

app.get('/readuser', (req, res) => {
    
    var params = {
        TableName: "emailserverless",
        Key: {
            "useremail": "nishantjawla12225@gmail.com"
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("Error in Fetching User - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Succesfully Fetching the User - " + JSON.stringify(data, null, 2));
            res.status(200).send(JSON.stringify(data, null, 2));
            if(Object.keys(data).length === 0){
                console.log("User Not Found!!!")
            } else {
                console.log("User Found!!!")
            }
        }
    })
})

module.exports = app;