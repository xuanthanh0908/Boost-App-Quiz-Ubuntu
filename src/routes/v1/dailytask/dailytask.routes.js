const express = require('express')
const dailyTaskController = require('../../../controllers/dailytask/dailytask.controller')
const authPage = require('../../../middlewares/Authorization')
const { verifyAccessToken } = require('../../../middlewares/VerifyAccessToken')
const router = express.Router()

router.post(
  '/',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  dailyTaskController.adddailyTask,
)

router.get(
  '/randomCategory',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  dailyTaskController.randomCategoryTasks,
)
router
  .route('/:userId', verifyAccessToken, authPage(['admin', 'mod', 'user']))
  .get(dailyTaskController.getdailyTask)
  .patch(dailyTaskController.updatedailyTask)
  .delete(dailyTaskController.removedailyTask)

module.exports = router
