const httpStatus = require('http-status')
const { User } = require('../../models')
const ApiError = require('../../utils/ApiError')

/**
 * get list user
 * @returns {Promise<User>}
 */
const getAllUsers = async () => {
  const listUser = await User.find({})
  return listUser
}

const updateUserById = async (id, fields) => {
  return User.findByIdAndUpdate(id, fields, { new: true })
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const user = await User.create(userBody)
  return user
}

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const foundUser = await User.findById(id)
  return foundUser
}

/**
 *
 * @param {*Object<String,Any>} field
 * @returns {*Promise<User>}
 */

/**
 * Delete User By Id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */

const deleteUserById = async (userId) => {
  const userDelete = await User.findByIdAndDelete(userId)
  return userDelete
}

/**
 *
 * @param {*Object<String,Any>} field
 * @returns {*Promise<Boolean>}
 */
const fieldExist = async (field) => {
  return User.exists(field)
}

const getUserByField = async (field) => {
  const user = await User.findOne(field)
  return user
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByField,
  fieldExist,
  updateUserById,
  deleteUserById,
}
