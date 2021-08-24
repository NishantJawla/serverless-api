require('dotenv').config()
module.exports = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    REGION: process.env.REGION,
    ENDPOINT: process.env.ENDPOINT,
    ACCESSKEYID: process.env.ACCESSKEYID,
    SECRETACCESSKEY: process.env.SECRETACCESSKEY,
    SALT : process.env.SALT,
    SECRET: process.env.SECRET
}