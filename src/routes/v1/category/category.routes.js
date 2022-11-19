const express = require('express')
const authPage = require('../../../middlewares/Authorization')
const { verifyAccessToken } = require('../../../middlewares/VerifyAccessToken')
const {
  getCate,
  addNewCate,
  removeCate,
  getAllCategories,
  getCategoryByName,
} = require('../../../controllers/category/category.controller')
const router = express.Router()

router.get('/getAll', getAllCategories)
router.get('/search', getCategoryByName)
router.post('/', addNewCate)
router.route('/:id').get(getCate).delete(removeCate)
module.exports = router
