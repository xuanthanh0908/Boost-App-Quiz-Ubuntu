const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const generateTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      { id: user._id },
      config.jwt.secretAccessToken,
      {
        expiresIn: `${config.jwt.accessExpirationMinutes}m`,
      },
    )
    const refreshToken = jwt.sign(
      { id: user._id },
      config.jwt.secretRefreshToken,
      {
        expiresIn: `${config.jwt.refreshExpirationDays}d`,
      },
    )
    return Promise.resolve({ accessToken, refreshToken })
  } catch (err) {
    return Promise.reject(err)
  }
}
module.exports = {
  generateTokens,
}
