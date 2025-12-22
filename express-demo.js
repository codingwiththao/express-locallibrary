// Writing middleware for use in Express apps: https://expressjs.com/en/guide/writing-middleware.html

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

// parse http request header and populate req.cookies with an object keyed by the cookie names. 
app.use(cookieParser())

const myLogger = function (req, res, next) {
    console.log('HTTP request:', req.originalUrl)
    next()
}

// use myLogger as next middleware function
app.use(myLogger)

const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

// use requestTime as next middleware function
app.use(requestTime)

// set cookie when user visits /cookies
app.get('/cookies', (req, res) => {
    res.cookie('name', 'express').send('cookie set')
})

// use middleware function to read cookies 
app.get('/', function (req, res, next) {
    console.log('Cookies: ', req.cookies)
    next()
})

// terminate request-response cycle
app.get('/', (req, res) => {
    let responseText = 'Hello World!<br>'
    responseText += `<small>Requested at: ${(new Date(req.requestTime)).toLocaleTimeString()}</small>`
    res.send(responseText)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(new Error(`${req.originalUrl} not found`))
})

// error handler
app.use((err, req, res, next) => {
    res.status(404).send(err.message)
})

console.log('Server running at http://localhost:3000/')
app.listen(3000)