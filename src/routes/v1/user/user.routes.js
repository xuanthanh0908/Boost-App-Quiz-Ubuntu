const userController = require('../../../controllers/user/user.controller')
const express = require('express')
const upload = require('../../../cloudinary/multer')
const { verifyAccessToken } = require('../../../middlewares/VerifyAccessToken')
const authPage = require('../../../middlewares/Authorization')
const router = express.Router()

router.get(
  '/search',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  userController.getUserByField,
)
router.get(
  '/',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  userController.getAllUsers,
)
router
  .route('/:id', verifyAccessToken, authPage(['admin', 'mod', 'user']))
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById)

router.post(
  '/uploadPhoto',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  upload.single('photo'),
  userController.uploadPhoto,
)
router.post(
  '/removePhoto',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  userController.removePhoto,
)

module.exports = router
