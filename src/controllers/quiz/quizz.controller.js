const catchAsync = require('../../utils/catch/catchAsync')
const { quizService, userService } = require('../../services')
const ApiError = require('../../utils/catch/ApiError')
const { Quiz } = require('../../models')
const loadash = require('lodash')

// Get quiz with the id in the request parameter
const getQuiz = catchAsync(async (req, res, next) => {
  const quizId = req.params.id
  let quiz
  const serverRecivedTime = Date.now()
  if (!quizId) {
    quiz = await quizService.getAllQuiz()
  } else quiz = await quizService.getQuizById(quizId)
  if (!quiz) {
    throw new ApiError(404, 'No quiz of this Id found!')
  }
  res.status(200).json({
    success: true,
    time: {
      totalServerInMs: `${serverRecivedTime - req.startTime} ms`,
      totalMongoInMs: `${Date.now() - serverRecivedTime} ms`,
      totalTimeInMs: `${Date.now() - req.startTime} ms`,
    },
    data: quiz,
  })
})

const getQuizzForsolo = catchAsync(async (req, res, next) => {
  let query = req.query.category
  if (!query) {
    throw new ApiError(404, `No query found !`)
  }
  query = query.replaceAll('+', '\\+')
  const quizz = await Quiz.find({
    // category: { $regex: /^c\+\+$/, $options: 'i' },
    category: { $regex: new RegExp('^' + query + '$'), $options: 'gi' },
  })
    .limit(40)
    .sort({ createdAt: -1 })
  if (!quizz || quizz.length === 0) {
    throw new ApiError(404, `No Quizz In database`)
  }
  let randDomSample = loadash.sampleSize(quizz, process.env.SOLO_MAX_QUESTION)
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: randDomSample,
  })
})

const getAllQuiz = catchAsync(async (req, res, next) => {
  const { limit, page } = req.query
  const quiz = await quizService.getAllQuiz(limit, page)
  res.json({
    success: 'OK',
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: quiz,
  })
})

// Add new quiz
const addQuiz = catchAsync(async (req, res, next) => {
  const { createdBy } = req.body
  const user = await userService.getUserById(createdBy)
  if (!user) {
    throw new ApiError(404, `User not found`)
  }
  const quiz = await quizService.addQuiz(req.body)
  res.status(201).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: quiz,
  })
})

// Update quiz with the id in request parameter
const updateQuiz = catchAsync(async (req, res, next) => {
  const quizId = req.params.id
  const field = req.body
  const updated = await quizService.updateQuizById(quizId, field)
  if (!updated) {
    throw new ApiError(304, 'Not modified!')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'Quizz has been updated !!',
  })
})

const removeQuiz = catchAsync(async (req, res, next) => {
  const quizId = req.params.id
  const deleted = quizService.deleteById(quizId)
  if (!deleted) {
    throw new ApiError(304, 'Not modified')
  }
  res.status(202).json({
    success: 'Deleted',
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'Quiz deleted',
  })
})

const getQuizByCategory = catchAsync(async (req, res, next) => {
  const field = req.params
  const { limit, page } = req.query
  const quizzes = await quizService.getQuizByField(field, limit, page)
  if (!quizzes) {
    throw new ApiError(404, 'Quiz not found !')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: quizzes,
  })
})

const getQuizByHashTags = catchAsync(async (req, res, next) => {
  const { hashtags, limit, page } = req.query
  const quizzes = await quizService.getQuizByHashTag(hashtags, limit, page)
  if (!quizzes) {
    throw new ApiError(404, 'Quiz not found !')
  }

  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: quizzes,
  })
})

const randomQuizzForCate = catchAsync(async (req, res, next) => {
  const { limit, category } = req.query
  const quiz = await Quiz.find({
    category: { $regex: category, $options: 'i' },
  })
    .sort({ createdAt: -1 })
    .limit(20)
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found !')
  }
  const randDomSample = loadash.sampleSize(quiz, parseInt(limit))
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: randDomSample,
  })
})

module.exports = {
  getQuiz,
  addQuiz,
  updateQuiz,
  removeQuiz,
  getQuizByCategory,
  getQuizByHashTags,
  randomQuizzForCate,
  getAllQuiz,
  getQuizzForsolo,
}
