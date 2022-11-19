const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const User = require('../../models')

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, config.jwt.secretRefreshToken, (err, result) => {
      if (err)
        return resolve({ success: false, message: 'Invalid refresh token' })
      resolve({
        userId: result.id,
        success: true,
        message: 'Valid refresh token',
      })
    })
  })
}

module.exports = {
  verifyRefreshToken,
}
