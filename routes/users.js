const express = require("express");

const User = require("../models/user");

const router = new express.Router();
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** GET / - get list of users. **/

router.get("/", async (req, res, next) => {
	try {
		const users = await User.all();
		console.log(users);
		return res.json(users);
	} catch (err) {
		return next(err);
	}
});

/** GET /:username - get detail of users **/

router.get("/:username", async function (req, res, next) {
	try {
		const user = await User.get(req.params.username);
		if (user.length === 0) {
			throw new ExpressError("User was not found", 404);
		}
		return res.json(user);
	} catch (err) {
		return next(err);
	}
});

/** GET /:username/to - get messages to user **/

router.get(
	"/:username/to",
	ensureCorrectUser,
	ensureLoggedIn,
	async (req, res, next) => {
		try {
			const results = await User.messagesTo(username);
			return res.json((messages = { results }));
		} catch (err) {
			return next(err);
		}
	}
);

/** GET /:username/from - get messages from user **/

router.get(
	"/:username/from",
	ensureCorrectUser,
	ensureLoggedIn,
	async (req, res, next) => {
		try {
			const results = await User.messagesTo(username);
			return res.json((messages = { results }));
		} catch (err) {
			return next(err);
		}
	}
);

module.exports = router;
