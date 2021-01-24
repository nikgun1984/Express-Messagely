const express = require("express");

const Message = require("../models/message");
// const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get(
	"/:id",
	ensureLoggedIn,
	ensureCorrectUser,
	async (req, res, next) => {
		try {
			const message = await Message.get(req.params.id);
			return res.status(200).json(message);
		} catch (err) {
			return next(err);
		}
	}
);

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
	try {
		const createdMessage = await Message.create(req.body);
		return res.status(201).json(createdMessage);
	} catch (err) {
		return next(err);
	}
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post(
	"/:id/read",
	ensureLoggedIn,
	ensureCorrectUser,
	async (req, res, next) => {
		try {
			const readMessage = await Message.markRead(req.params.id);
			return res.status(201).json(readMessage);
		} catch (err) {
			return next(err);
		}
	}
);
