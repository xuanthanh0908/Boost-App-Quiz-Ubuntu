const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const config = require('../config/config')

const verifyAccessToken = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization // get from req
    jwt.verify(token, config.jwt.secretAccessToken, (err, result) => {
      if (err) throw new ApiError(403, 'You are not authorized !!')
      req.user = result
      next()
    })
  } else throw new ApiError(401, 'You are not authenticated !!')
}

module.exports = {
  verifyAccessToken,
}
