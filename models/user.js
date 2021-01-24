/** User class for message.ly */
const bcrypt = require("bcrypt");
const { json } = require("body-parser");

const { BCRYPT_WORK_FACTOR } = require("../config");
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
			return await bcrypt.compare(password, user.password);
		}
		return false;
	}

	/** Update last_login_at for user */
	static async updateLoginTimestamp(username) {
		const lastLoginAt = new Date();
		console.log(lastLoginAt);
		await db.query(
			`
          UPDATE users SET last_login_at =$1 WHERE username=$2 RETURNING username
        `,
			[lastLoginAt, username]
		);
	}

	/** All: basic info on all users:*/
	static async all() {
		const results = await db.query(`
      SELECT username, first_name, last_name, phone FROM users
    `);
		return results.rows;
	}

	/** Get: get user by username*/
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

	/** Return messages from this user.*/
	static async messagesFrom(username) {
		const result = await db.query(
			`SELECT m.id,
                m.to_username,
                u.first_name,
                u.last_name,
                u.phone,
                m.body,
                m.sent_at,
                m.read_at
          FROM messages AS m
            JOIN users AS u ON m.to_username = u.username
          WHERE from_username = $1`,
			[username]
		);

		return result.rows.map((m) => ({
			id: m.id,
			to_user: {
				username: m.to_username,
				first_name: m.first_name,
				last_name: m.last_name,
				phone: m.phone,
			},
			body: m.body,
			sent_at: m.sent_at,
			read_at: m.read_at,
		}));
	}

	/** Return messages to this user.*/
	static async messagesTo(username) {
		const result = await db.query(
			`SELECT m.id,
                m.from_username,
                u.first_name,
                u.last_name,
                u.phone,
                m.body,
                m.sent_at,
                m.read_at
          FROM messages AS m
           JOIN users AS u ON m.from_username = u.username
          WHERE to_username = $1`,
			[username]
		);

		return result.rows.map((m) => ({
			id: m.id,
			from_user: {
				username: m.from_username,
				first_name: m.first_name,
				last_name: m.last_name,
				phone: m.phone,
			},
			body: m.body,
			sent_at: m.sent_at,
			read_at: m.read_at,
		}));
	}
}

module.exports = User;
