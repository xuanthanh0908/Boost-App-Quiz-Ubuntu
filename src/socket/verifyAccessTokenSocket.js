const jwt = require('jsonwebtoken')
const ApiError = require('../utils/catch/ApiError')
const config = require('../config/config')

const verifyAccessTokenForSocket = (token, handleError) => {
  if (token) {
    jwt.verify(token, config.jwt.secretAccessToken, handleError)
  } else throw new ApiError(404, 'Invalid Token !!')
}

module.exports = {
  verifyAccessTokenForSocket,
}
