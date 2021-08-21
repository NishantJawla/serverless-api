var passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const docClient = require("./aws");
const {SECRET} = require('./secret')
const opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;

  module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload,done) => {
        const paramsforusertable = {
            TableName: "uuidserverless",
            Key: {
              uuid: jwt_payload.uuid
            },
          };

        docClient.get(paramsforusertable, (err, data) => {
            if(err){
                return done(err);
            }
            else if (Object.keys(data).length === 0) {
                return done(null, false);
              }
              else {
                return done(null, data);
              }
          });


    }));
}