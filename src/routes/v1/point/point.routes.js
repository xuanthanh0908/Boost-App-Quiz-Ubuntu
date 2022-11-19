const express = require('express')
const authPage = require('../../../middlewares/Authorization')
const { verifyAccessToken } = require('../../../middlewares/VerifyAccessToken')
const {
  updatePoints,
  getPointsByUserId,
} = require('../../../controllers/point/point.controller')
const router = express.Router()

router.get('/:userId', verifyAccessToken, getPointsByUserId)
router.patch('/:userId', verifyAccessToken, updatePoints)

module.exports = router
