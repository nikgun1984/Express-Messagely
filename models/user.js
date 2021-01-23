/** User class for message.ly */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const db = require("../db");

/** User of the site. */

class User {
	/** Register to the system */
	static async register({ username, password, first_name, last_name, phone }) {
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO users (username, password,first_name,last_name,phone) 
      VALUES($1,$2,$3,$4,$5) RETURNING username, first_name, last_name, phone`,
			[username, hashedPassword, first_name, last_name, phone]
		);
		return result.rows[0];
	}

	/** Authenticate: is this username/password valid? Returns boolean. */

	static async authenticate(username, password) {
		const result = await db.query(
			`
      SELECT password FROM users
      WHERE username=$1
    `,
			[username]
		);
		const user = result.rows[0];

		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				jwt.sign({ username }, SECRET_KEY);
				return true;
			}
		}
		return false;
	}

	/** Update last_login_at for user */

	static async updateLoginTimestamp(username) {
		const lastLoginAt = new Date();
		await db.query(
			`
          UPDATE users SET last_login_at =$1 WHERE username=$2
        `,
			[lastLoginAt, username]
		);
	}

	/** All: basic info on all users:
	 * [{username, first_name, last_name, phone}, ...] */

	static async all() {
		const results = await db.query(`
      SELECT username, first_name, last_name, phone FROM users
    `);
		return results.rows;
	}

	/** Get: get user by username
	 *
	 * returns {username,
	 *          first_name,
	 *          last_name,
	 *          phone,
	 *          join_at,
	 *          last_login_at } */

	static async get(username) {
		console.log(username);
		const result = await db.query(
			`
        SELECT username, first_name, last_name,phone, join_at, last_login_at FROM users WHERE username=$1
      `,
			[username]
		);
		console.log(result.rows);
		return result.rows;
	}

	/** Return messages from this user.
	 *
	 * [{id, to_user, body, sent_at, read_at}]
	 *
	 * where to_user is
	 *   {username, first_name, last_name, phone}
	 */

	static async messagesFrom(username) {
		//const result
	}

	/** Return messages to this user.
	 *
	 * [{id, from_user, body, sent_at, read_at}]
	 *
	 * where from_user is
	 *   {id, first_name, last_name, phone}
	 */

	static async messagesTo(username) {}
}

module.exports = User;
