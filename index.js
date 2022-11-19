const mongoose = require('mongoose')
const { app, config } = require('./app')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const { socketHandler } = require('./src/socket/socketHandler.js')
const {
  verifyAccessTokenForSocket,
} = require('./src/socket/verifyAccessTokenSocket')
const ApiError = require('./src/utils/ApiError')
const { chatHandler } = require('./src/socket/chatHandler')

app.use(cors)
let server

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB')
  server = http.createServer({}, app)
  // init socket
  const Server = socketIo.Server
  let io = new Server(server, {
    pingTimeOut: 3 * 60 * 1000,
    autoConnect: true,
    cors: {
      origin: '*',
    },
  })
  const pvpNameSpaceSocket = io.of('/pvp')
  const chatNameSpaceSocket = io.of('/chat')
  pvpNameSpaceSocket.io = io
  // chatHandler(chatSockets)
  //   .then((handler) => {
  //     chatNamespace.on('connection', handler)
  //   })
  //   .catch((error) => console.log(error))
  socketHandler(pvpNameSpaceSocket)
    .then((handler) => {
      pvpNameSpaceSocket.on('connection', handler)
      // io.use(function (socket, next) {
      //   var token = socket.request.accessToken
      //   verifyAccessTokenForSocket(token, (err, result) => {
      //     if (err || !result) {
      //       throw new ApiError(404, 'You are not authorized !!')
      //     }
      //     next()
      //   })
      // })
    })
    .catch((error) => console.log(error))
  server.listen(config.port, () => {
    console.info(`--- Server Started --- http://localhost:${config.port}`)
  })
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  console.log(error)
  // exitHandler();
}

process.on('unhandledRejection', unexpectedErrorHandler)
process.on('uncaughtException', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  console.log('SIGTERM received')
  // if (server) {
  //   server.close();
  // }
})
