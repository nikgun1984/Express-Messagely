const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");

const router = new express.Router();

router.get("/", (req, res, next) => {
	res.send("THE APP IS WORKING!!!");
});

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (await User.authenticate(username, password)) {
			await User.updateLoginTimestamp(username);
			const token = jwt.sign({ username }, SECRET_KEY);
			console.log(`My user is ${req.user.username}`);
			return res.status(200).json({ token });
		}
	} catch (err) {
		return next({ status: 401, message: "Wrong Password/Username" });
	}
});

router.post("/register", async (req, res, next) => {
	try {
		const { username, password, first_name, last_name, phone } = req.body;
		await User.register({
			username,
			password,
			first_name,
			last_name,
			phone,
		});
		await User.updateLoginTimestamp(username);
		if (await User.authenticate(username, password)) {
			const token = jwt.sign({ username }, SECRET_KEY);
			return res.status(201).json({ token });
		}
	} catch (err) {
		return next({ status: 409, message: "The User already exists..." });
	}
});

module.exports = router;
