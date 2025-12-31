require("dotenv").config();

const compression = require("compression");
const helmet = require("helmet");

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const process = require("node:process");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

const app = express();
app.use(compression());

// view engine setup
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set up mongoose connection
const mongoDB = process.env.MONGODB_URI
if (!mongoDB) {
    console.error('Environment variable MONGODB_URI must be set in order to connect to the MongoDB database.')
    process.exit(-1)
}
mongoose.set('strictQuery', false)

async function main () {
    try {
        console.log('Connecting...')
        await mongoose.connect(mongoDB)
        console.log('Connection to MongoDB established.')
        mongoose.connection.on('error', console.error)
    }
    catch(err) {
        console.error('Connection to MongoDB failed: ', err)
        process.exit(-1)
    }
}

main().catch(console.error)

module.exports = app;
