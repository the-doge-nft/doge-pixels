const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { logs } = require('./vars')
const routes = require('../api/routes/v1')
const logger = require("./config");

const app = express();

app.use(morgan(logs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/v1', routes)

function errorLogger(error, req, res, next) {
  logger.error(error)
  next(error)
}

function errorResponder(error, req, res, next) {
  const message = error.message ? error.message : "Error"
  res.status(400).send({message: message})
}

app.use(errorLogger)
app.use(errorResponder)

// // catch 404 and forward to error handler
// app.use(error.notFound);
//
// // error handler, send stacktrace only during development
// app.use(error.handler);

module.exports = app;
