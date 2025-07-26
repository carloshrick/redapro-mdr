// netlify/functions/api.js
const express = require('express');
const routes = require('../../routes.js');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/.netlify/functions/app', routes);

module.exports.handler = serverless(app);
