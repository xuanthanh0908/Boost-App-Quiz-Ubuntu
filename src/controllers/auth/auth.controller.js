const catchAsync = require('../../utils/catch/catchAsync')
const bcrypt = require('bcryptjs')
const ApiError = require('../../utils/catch/ApiError')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const { userService } = require('../../services')
const { generateTokens } = require('../../services/auth/generateToken.service')
const firebase = require('../../config/firebase')
const {
  verifyRefreshToken,
} = require('../../services/auth/verifyRefreshToken.service')
const { checkNullInput } = require('../../utils/catch/checkExitsField')

const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body
  const isValid = await verifyRefreshToken(refreshToken)
  if (!isValid.success) {
    throw new ApiError(401, 'Invalid refresh token')
  }
  const accessToken = jwt.sign(
    { id: isValid.userId },
    config.jwt.secretAccessToken,
    {
      expiresIn: `${config.jwt.accessExpirationMinutes}m`,
    },
  )
  res.status(201).json({
    status: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: {
      accessToken,
    },
  })
})

const signUp = catchAsync(async (req, res, next) => {
  // checkNullInput(req.body, ['email', 'password', 'displayname'])
  const { email, password, fireBaseToken, authProvider, ...rest } = req.body
  const username = 'username_' + Date.now().toString()
  // check user sign up by which ones - google, facebook
  if (fireBaseToken) {
    try {
      const verifyFBtoken = await firebase.auth().verifyIdToken(fireBaseToken)
      if (verifyFBtoken) {
        const userFromFB = await userService.getUserByField({
          email: verifyFBtoken.email,
        })
        if (!userFromFB) {
          const user = await userService.createUser({
            uid: verifyFBtoken.displayName,
            username: username,
            displayname: verifyFBtoken.displayName,
            age: verifyFBtoken.displayName,
            email: verifyFBtoken.email,
            avatar: {
              url: verifyFBtoken.photoURL,
            },
            typeLogin: authProvider,
          })
          const { accessToken, refreshToken } = await generateTokens(user._doc)
          await user.save()
          res.status(201).json({
            success: true,
            data: {
              accessToken,
              refreshToken,
              totalTimeInMs: `${Date.now() - req.startTime} ms`,
            },
          })
        }
        throw new ApiError(403, 'Account exists !!')
      }
    } catch (error) {
      throw new ApiError(403, 'You are not authorization !!')
    }
  } else {
    if (await userService.fieldExist({ email })) {
      throw new ApiError(404, 'email taken')
    }
    // hash password bcrypt with level 8 - normal level
    const salt = bcrypt.genSaltSync(8)
    const hash = bcrypt.hashSync(password, salt)
    const user = await userService.createUser({
      ...req.body,
      username,
      password: hash,
    })
    const { accessToken, refreshToken } = await generateTokens(user._doc)
    await user.save()
    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        totalTimeInMs: `${Date.now() - req.startTime} ms`,
      },
    })
  }
})

const Login = catchAsync(async (req, res, next) => {
  // checkNullInput(req.body, ['email', 'password'])
  const { email, password, fireBaseToken } = req.body
  // check if user authen with firebase method
  if (fireBaseToken) {
    try {
      const verifyFBtoken = await firebase.auth().verifyIdToken(fireBaseToken)
      const userFromFB = await userService.getUserByField({
        email: verifyFBtoken.email,
      })
      if (!userFromFB) {
        throw new ApiError(404, 'No user with this email found')
      }
      const { accessToken, refreshToken } = await generateTokens(
        userFromFB._doc,
      )
      res.status(200).json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          totalTimeInMs: `${Date.now() - req.startTime} ms`,
        },
      })
    } catch (error) {
      throw new ApiError(403, error.message)
    }
  }
  const user = await userService.getUserByField({ email })
  if (!user) {
    throw new ApiError(404, 'no user with this emails found')
  }
  // check correct password
  const isCorrectPW = await bcrypt.compare(password, user.password)
  if (!isCorrectPW) {
    throw new ApiError(404, 'Invalid Password')
  }
  const { accessToken, refreshToken } = await generateTokens(user._doc)
  // accepted login
  res.status(200).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      totalTimeInMs: `${Date.now() - req.startTime} ms`,
    },
  })
})

module.exports = {
  signUp,
  Login,
  refreshToken,
}
