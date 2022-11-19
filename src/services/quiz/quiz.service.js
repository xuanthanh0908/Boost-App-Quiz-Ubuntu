const { Quiz } = require('../../models')
const httpStatus = require('http-status')
const ApiError = require('../../utils/ApiError')

/**
 *
 * @param {*} quizId
 * @returns
 */
const getQuizById = async (quizId) => {
  const quiz = await Quiz.findById(quizId)
  return quiz
}

const getAllQuiz = async (limit = 10, page) => {
  const skip = (page - 1) * limit
  return await Quiz.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
}

/**
 *
 * @param {*} fields
 * @returns
 */
const addQuiz = async (fields) => {
  const quiz = await Quiz.create(fields)
  return quiz
}

/**
 *
 * @param {*} id
 * @param {*} fields
 * @returns
 */
const updateQuizById = async (id, fields) => {
  const quiz = await Quiz.findByIdAndUpdate(id, fields)
  console.log(quiz)
  return quiz
}
/**
 *
 * @param {*} fields
 * @returns
 */
const quizExists = async (fields) => {
  return await Quiz.exists(fields)
}

/**
 *
 * @param {*} id
 * @returns
 */
const deleteById = async (id) => {
  return await Quiz.findByIdAndDelete(id)
}

const getQuizByField = async (fields, page, limit) => {
  limit = limit || 10
  const skip = (page - 1) * limit
  return await Quiz.find(fields).sort({ createdAt: -1 }).skip(skip).limit(limit)
}

const getQuizByHashTag = async (hashtag, limit, page) => {
  limit = limit || 10
  const pattern = `#(?i)${hashtag}(?-i)`
  const skip = (page - 1) * limit
  let quiz = await Quiz.find({ hashtags: { $regex: pattern } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
  return quiz
}

module.exports = {
  getQuizById,
  quizExists,
  addQuiz,
  updateQuizById,
  deleteById,
  getQuizByField,
  getQuizByHashTag,
  getAllQuiz,
}
