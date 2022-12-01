const express = require('express')
const compression = require('compression')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const fs = require('fs')
const helmet = require('helmet')
const { errorHandler } = require('./src/middlewares/Error')
const app = express()
const config = require('./src/config/config')
const { MainRoutes } = require('./src/routes/v1/mainRoutes')
const requestTime = require('./src/middlewares/RequestTime')

// set limited request
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200, // limit each IP to 200 requests per window/Ms
// })
app.use(helmet())
if (process.env.NODE_ENV === 'production') {
  // app.use(limiter)
  app.use(
    logger('common', {
      stream: fs.createWriteStream('./access.log', { flags: 'a' }),
    }),
  )
} else {
  app.use(logger('dev'))
}
// enable cors
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
)
app.options(
  '*',
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
)

// parse json request body
app.use(bodyParser.json())

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: false }))

// gzip compression
app.use(compression())

// cookie-parser
app.use(cookieParser('localhost'))

// get start time request
app.use(requestTime)

// all routes
app.use('/api/v1', MainRoutes)
// handle catch error
app.use(errorHandler)
module.exports = {
  app,
  config,
}
