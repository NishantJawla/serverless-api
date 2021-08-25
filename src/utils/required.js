module.exports = {
    express: require('express'),
    docClient: require('../config/aws'),
    cors: require('cors'),
    bcrypt: require('bcryptjs'),
    jwt: require('jsonwebtoken'),
    passport: require('passport'),
    AWS: require("aws-sdk"),
    JwtStrategy : require('passport-jwt').Strategy,
    ExtractJwt : require('passport-jwt').ExtractJwt
};