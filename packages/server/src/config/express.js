const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { logs } = require('./vars')
const routes = require('../api/routes/v1')

const app = express();

app.use(morgan(logs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/v1', routes)

// // catch 404 and forward to error handler
// app.use(error.notFound);
//
// // error handler, send stacktrace only during development
// app.use(error.handler);

module.exports = app;
