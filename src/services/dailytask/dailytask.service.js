const DailyTask = require('../../models/dailyTasks.model')

/**
 * get daily task by  userID
 * @param {*} userId
 * @returns {Promise<DailyTask>}
 */
const getTaskByUserId = async (userId) => {
  const taskUser = await DailyTask.findOne({ userId: userId })
  return taskUser
}
/**
 * get daily task by  id task
 * @param {*ObjectId} id
 * @returns {Promise<DailyTask>}
 */
const getTaskById = async (id) => {
  const task = await DailyTask.findById(id)
  return task
}
/**
 *
 * @param {*Object} data
 * @returns  {Promise<DailyTask>}
 */
const addTask = async (data) => {
  const task = await DailyTask.create(data)
  return task
}

/**
 *
 * @param {import('mongoose').ObjectId} id
 * @returns {Promise<DailyTask>}
 */
const removeTask = async (id) => {
  const task = await DailyTask.findOneAndDelete({ userId: id })
  return task
}

/**
 *
 * @param {*ObjectId} id
 * @param {*Object} data
 * @returns {Promise<DailyTask>}
 */
const updateTask = async (id, data) => {
  const task = await DailyTask.findOneAndUpdate({ userId: id }, data)
  return task
}

module.exports = {
  getTaskByUserId,
  getTaskById,
  addTask,
  removeTask,
  updateTask,
}
