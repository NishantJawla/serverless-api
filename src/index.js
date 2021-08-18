const e = require('express');
const express = require('express');
const app = express();
const docClient = require('./aws')
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Hi Welcome to the API")
})

app.post('/readuser', (req, res) => {
    const value = req.body.value;
    var dataType = "phonenumber"
    if(value.includes("@")){
        console.log("Value is an Email")
        dataType = "email";
    } 
    
    if(dataType === 'email'){
        var params = {
            TableName: "emailserverless",
            Key: {
                "useremail": value
            }
        };
    } else {
        var params = {
            TableName: "phonenumberserverless",
            Key: {
                "userphonenumber": value
            }
        };
    }
    
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("Error in Fetching User : " + JSON.stringify(err, null, 2));
            res.status(500).json({
                error: "Server Failure!!"
            })
        }
        else {
            console.log("Succesfully Fetching the User : " + JSON.stringify(data, null, 2));
            if(Object.keys(data).length === 0){
                console.log("User Not Found!!!")
                res.status(404).json({
                    error: "Invalid email/ phoneNumber"
                })
            } else {
                const response = data.Item;
                console.log(response)
                const paramsforusertable = {
                    TableName: "uuidserverless",
                    Key: {
                        "uuid": response.uuid
                    }
                };
                docClient.get(paramsforusertable, function (err, data) {
                    if(err) {
                        console.log("unable to retrieve data from server uuid serverless table")
                        res.status(500).json({
                            error: "Server Failure!!"
                        })
                    } else {
                        const role = data.Item.role;
                        if(role === "superadmin"){
                            res.redirect('https://www.google.com/')
                        } else if(role === "companyadmin"){
                            res.redirect('https://www.youtube.com/')
                        } else {
                            res.redirect('https://github.com/')
                        }
                    }
                })
            }

        }
    })
})

module.exports = app;