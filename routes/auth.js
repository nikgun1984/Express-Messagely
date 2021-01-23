const express = require("express");

const User = require("../models/user");
const ExpressError = require("../expressError");

const router = new express.Router();

router.get("/", (req, res, next) => {
	res.send("THE APP IS WORKING!!!");
});

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (await User.authenticate(username, password)) {
			await User.updateLoginTimestamp(username);
			return res.json({ message: "Successfully Logged in" });
		}
		throw new ExpressError("Invalid User/Password", 400);
	} catch (err) {
		return next(err);
	}
});

router.post("/register", async (req, res, next) => {
	console.log("I AM OUTSIDE TRY AND CATCH BLOCK MF");
	try {
		console.log(req.body);
		console.log("IN HERE REGISTER");
		const { username, password, first_name, last_name, phone } = req.body;
		const user = await User.register({
			username,
			password,
			first_name,
			last_name,
			phone,
		});
		await User.updateLoginTimestamp(username);
		return res.json({ message: "Successfully Registered" });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
