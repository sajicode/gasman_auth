const express = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();

const secret = process.env.JWT_SECRET;

router.post(
	'/token',
	[
		check('_id', 'User ID is required').not().isEmpty(),
		check('fullName', 'Full name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('phone', 'User phone is required').not().isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ status: 'fail', errors: errors.array() });
		}

		try {
			const { fullName, email, phone, _id } = req.body;
			const payload = {
				user: {
					fullName,
					email,
					phone,
					id: _id
				}
			};

			jwt.sign(payload, secret, { expiresIn: '365d' }, (err, token) => {
				if (err) throw err;
				res.status(200).send({ status: 'success', token });
			});
		} catch (error) {
			console.log(error);
			res.status(500).send({ status: 'fail', message: error.message });
		}
	}
);

router.post('/verify', async (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res.status(401).send({ status: 'fail', message: 'No auth token' });
	}

	jwt.verify(token, secret, async (err, payload) => {
		if (err) {
			console.log(err);
			return res.status(401).send({ status: 'fail', message: 'Invalid auth token' });
		}

		const { user } = payload;

		res.status(200).send({ status: 'success', data: user });
	});
});

router.get('/test', (req, res) => {
	res.status(200).send({ status: 'success', data: 'Pump It' });
});

module.exports = router;
