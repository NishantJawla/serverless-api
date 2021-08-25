const {
	docClient,
	ExtractJwt,
	JwtStrategy,
	passport
} = require("../utils/required");
const { SECRET } = require("../utils/secret");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;

module.exports = passport => {
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			const paramsforusertable = {
				TableName: "uuidserverless",
				Key: {
					uuid: jwt_payload.uuid
				}
			};

			docClient.get(paramsforusertable, (err, data) => {
				if (err) {
					return done(err);
				} else if (Object.keys(data).length === 0) {
					return done(null, false);
				} else {
					return done(null, data);
				}
			});
		})
	);
};
