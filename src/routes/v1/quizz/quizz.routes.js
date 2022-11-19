const express = require('express')
const authPage = require('../../../middlewares/Authorization')
const { verifyAccessToken } = require('../../../middlewares/VerifyAccessToken')
const router = express.Router()
const quizController = require('../../../controllers/quiz/quizz.controller')

router.get(
  '/',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  quizController.getAllQuiz,
)
router.post(
  '/',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  quizController.addQuiz,
)
router.get(
  '/hashtags',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  quizController.getQuizByHashTags,
)
router.get(
  '/randomQuizs',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  quizController.randomQuizzForCate,
)
router.get(
  '/solo',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  quizController.getQuizzForsolo,
)
router
  .route(
    '/:id',
    //  verifyAccessToken, authPage(['admin', 'mod', 'user'])
  )
  .get(quizController.getQuiz)
  .delete(quizController.removeQuiz)
  .patch(quizController.updateQuiz)

router.get(
  '/category/:category',
  // verifyAccessToken,
  // authPage(['admin', 'mod', 'user']),
  quizController.getQuizByCategory,
)

module.exports = router
