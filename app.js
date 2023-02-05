require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./api');

// Setup your Middleware and API Router here
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/api', router);

module.exports = app;
