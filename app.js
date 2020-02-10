const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv');

const authRouter = require('./routes/auth');

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send({ status: 'fail', message: err.message });
});

module.exports = app;
