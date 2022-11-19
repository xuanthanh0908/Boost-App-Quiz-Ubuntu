const express = require('express')
const router = express.Router()
const statisticalController = require('../../../controllers/statistical/statistical.controller')
const authPage = require('../../../middlewares/Authorization')
// endpoints statistical for user
router.get('/user', statisticalController.getAllNewUser)
router.get('/user/gender', statisticalController.getAllNewUserByGender)
router.get('/user/age', statisticalController.getAllNewUserByAge)
// endpoints statistical for category
router.get('/category', statisticalController.getAllNewUser)
router.get('/category/gender', statisticalController.getAllNewUserByGender)
router.get('/category/age', statisticalController.getAllNewUserByAge)
// endpoints statistical for leaderboard
router.get('/leaderboard', statisticalController.getAllNewUser)
router.get('/leaderboard/gender', statisticalController.getAllNewUserByGender)
router.get('/leaderboard/age', statisticalController.getAllNewUserByAge)

module.exports = router
