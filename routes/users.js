const express = require("express");

const User = require("../models/user");

const router = new express.Router();
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** GET / - get list of users. **/

router.get("/", ensureLoggedIn, async (req, res, next) => {
	try {
		const users = await User.all();
		return res.json(users);
	} catch (err) {
		return next(err);
	}
});

/** GET /:username - get detail of users **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
	try {
		const user = await User.get(req.params.username);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** GET /:username/to - get messages to user **/

router.get("/:username/to", ensureCorrectUser, async (req, res, next) => {
	try {
		const results = await User.messagesTo(username);
		return res.json({ results });
	} catch (err) {
		return next(err);
	}
});

/** GET /:username/from - get messages from user **/

router.get("/:username/from", ensureCorrectUser, async (req, res, next) => {
	try {
		const results = await User.messagesTo(username);
		return res.json((messages = { results }));
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
