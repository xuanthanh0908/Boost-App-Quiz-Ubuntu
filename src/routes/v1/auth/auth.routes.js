const express = require('express')
const router = express.Router()
const {
  signUp,
  Login,
  refreshToken,
} = require('../../../controllers/auth/auth.controller')
const authPage = require('../../../middlewares/Authorization')
// endpoints for authentication
router.post('/signup', signUp)
router.post('/login', Login)
router.post('/refreshToken', authPage(['admin', 'mod', 'user']), refreshToken)

module.exports = router
