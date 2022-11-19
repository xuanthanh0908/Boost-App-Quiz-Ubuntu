const express = require('express')
const {
  DailyTaskRoutes,
  AuthRoutes,
  QuizzRoutes,
  UserRoutes,
  CategoriesRoutes,
  PointRoutes,
  StatisticalRoutes,
} = require('.')

const router = express.Router()

// endpoints for authentication
router.use('/auth', AuthRoutes)
// endpoints for quizzes
router.use('/quizz', QuizzRoutes)
// endpoints for user
router.use('/user', UserRoutes)
// endpoints for daily task
router.use('/dailyTask', DailyTaskRoutes)
// enpoints for categories
router.use('/categories', CategoriesRoutes)
// enpoints for points
router.use('/points', PointRoutes)
// enpoints for statistical
router.use('/statistical', StatisticalRoutes)

module.exports.MainRoutes = router
