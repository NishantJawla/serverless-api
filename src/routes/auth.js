const {
	jwt,
	express,
	docClient,
	cors,
	bcrypt,
	passport
} = require("../utils/required");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { SALT, SECRET } = require("../utils/secret");
router.post("/readuser", (req, res) => {
	const value = req.body.value;
	var dataType = "phonenumber";
	if (value.includes("@")) {
		console.log("Value is an Email");
		dataType = "email";
	}

	if (dataType === "email") {
		var params = {
			TableName: "emailserverless",
			Key: {
				useremail: value
			}
		};
	} else {
		var params = {
			TableName: "phonenumberserverless",
			Key: {
				userphonenumber: value
			}
		};
	}

	docClient.get(params, function (err, data) {
		if (err) {
			console.log(
				"Error in Fetching User : " + JSON.stringify(err, null, 2)
			);
			res.status(500).json({
				error: "Server Failure!!"
			});
		} else {
			console.log(
				"Succesfully Fetching the User : " +
					JSON.stringify(data, null, 2)
			);
			if (Object.keys(data).length === 0) {
				console.log("User Not Found!!!");
				res.status(404).json({
					error: "Invalid email/ phoneNumber"
				});
			} else {
				const response = data.Item;
				console.log(response);
				const paramsforusertable = {
					TableName: "uuidserverless",
					Key: {
						uuid: response.uuid
					}
				};
				docClient.get(paramsforusertable, function (err, data) {
					if (err) {
						console.log(
							"unable to retrieve data from server uuid serverless table"
						);
						res.status(500).json({
							error: "Server Failure!!"
						});
					} else {
						const role = data.Item.role;
						if (role === "superadmin") {
							res.redirect("https://www.google.com/");
						} else if (role === "companyadmin") {
							res.redirect("https://www.youtube.com/");
						} else {
							res.redirect("https://github.com/");
						}
					}
				});
			}
		}
	});
});

router.post("/signin", (req, res) => {
	const value = req.body.value;
	var dataType = "phonenumber";
	if (value.includes("@")) {
		console.log("Value is an Email");
		dataType = "email";
	}

	if (dataType === "email") {
		var params = {
			TableName: "emailserverless",
			Key: {
				useremail: value
			}
		};
	} else {
		var params = {
			TableName: "phonenumberserverless",
			Key: {
				userphonenumber: value
			}
		};
	}

	docClient.get(params, function (err, data) {
		if (err) {
			console.log(
				"Error in Fetching User : " + JSON.stringify(err, null, 2)
			);
			res.status(500).json({
				error: "Server Failure!!"
			});
		} else {
			console.log(
				"Succesfully Fetching the User : " +
					JSON.stringify(data, null, 2)
			);
			if (Object.keys(data).length === 0) {
				console.log("User Not Found!!!");
				res.status(404).json({
					error: "Invalid email/ phoneNumber"
				});
			} else {
				const response = data.Item;
				console.log(response);
				const paramsforusertable = {
					TableName: "uuidserverless",
					Key: {
						uuid: response.uuid
					}
				};
				docClient.get(paramsforusertable, function (err, data) {
					if (err) {
						console.log(
							"unable to retrieve data from server uuid serverless table"
						);
						res.status(500).json({
							error: "Server Failure!!"
						});
					} else {
						bcrypt.compare(
							req.body.password,
							data.Item.password,
							function (err, result) {
								// res === true
								if (result === true) {
									const payload = {
										uuid: data.Item.uuid,
										email: data.Item.email,
										username: data.Item.username
									};
									console.log(payload);
									jwt.sign(
										payload,
										SECRET,
										{ expiresIn: 3600 },
										(err, token) => {
											if (err) {
												console.log(
													"Error Occured in jwt signing"
												);
												console.log(err);
											}
											return res.status(200).json({
												token: "Bearer " + token
											});
										}
									);
								} else {
									res.status(200).json({
										error: "Password is Invalid"
									});
								}
							}
						);
					}
				});
			}
		}
	});
});

router.post("/signup", (req, res) => {
	const { email, password, name, phoneNumber, username } = req.body;
	var encryptedPassword = undefined;
	bcrypt.genSalt(10, function (err, SALT) {
		bcrypt.hash(password, SALT, function (err, hash) {
			encryptedPassword = hash;
		});
	});
	let params = {
		TableName: "emailserverless",
		Key: {
			useremail: email
		}
	};
	docClient.get(params, (err, data) => {
		if (err) {
			return res.status(500).json({
				error: "server error"
			});
		} else {
			if (Object.keys(data).length !== 0) {
				res.status(404).json({
					error: "User with email address already exists"
				});
			} else {
				var params = {
					TableName: "phonenumberserverless",
					Key: {
						userphonenumber: phoneNumber
					}
				};
				docClient.get(params, (err, data) => {
					if (err) {
						return res.status(500).json({
							error: "server error"
						});
					} else {
						if (Object.keys(data).length !== 0) {
							res.status(404).json({
								error: "User with Phone Number already exists"
							});
						} else {
							const uniqueId = uuidv4();
							let input = {
								uuid: uniqueId,
								email,
								name,
								password: encryptedPassword,
								phone: phoneNumber,
								role: "user",
								username
							};
							let params = {
								TableName: "uuidserverless",
								Item: input
							};
							docClient.put(params, function (err, data) {
								if (err) {
									res.status(500).json({
										error: "Server Side error"
									});
								} else {
									let input = {
										userphonenumber: phoneNumber,
										uuid: uniqueId
									};
									let params = {
										TableName: "phonenumberserverless",
										Item: input
									};
									docClient.put(params, function (err, data) {
										if (err) {
											res.status(500).json({
												error: "Server Side error"
											});
										} else {
											let input = {
												uuid: uniqueId,
												useremail: email
											};
											let params = {
												TableName: "emailserverless",
												Item: input
											};
											docClient.put(
												params,
												function (err, data) {
													if (err) {
														console.log(
															"users::save::error - " +
																JSON.stringify(
																	err,
																	null,
																	2
																)
														);
													} else {
														res.status(200).json({
															msg: "Succesfully signed up user"
														});
													}
												}
											);
										}
									});
								}
							});
						}
					}
				});
			}
		}
	});
});

module.exports = router;
