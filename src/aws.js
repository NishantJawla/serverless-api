var AWS = require("aws-sdk");
const {REGION,ENDPOINT,ACCESSKEYID,SECRETACCESSKEY} = require('./secret');
let awsConfig = {
    "region": REGION,
    "endpoint": ENDPOINT,
    "accessKeyId": ACCESSKEYID,
    "secretAccessKey": SECRETACCESSKEY
};

AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();
module.exports= docClient;