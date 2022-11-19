const httpStatus = require('http-status')
const userService = require('../../services/user/user.service')
const ApiError = require('../../utils/ApiError')
const catchAsync = require('../../utils/catchAsync')
const { uploadfile, removefile } = require('../../cloudinary')

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers()
  if (!users) throw new ApiError(httpStatus.NOT_FOUND, 'Users not found')
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: { users },
  })
})

const getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  const { password, ...rest } = user._doc
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: rest,
  })
})

const updateUserById = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserById(req.params.id, req.body)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Cannot update')
  res.json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
  })
})

const getUserByField = catchAsync(async (req, res, next) => {
  const key = Object.keys(req.query)[0]
  const value = req.query
  selectedUsers = null
  if (key && key === 'displayname') {
    selectedUsers = await userService.getUserByField({
      [key]: { $regex: value[key], $option: 'i' },
    })
  }
  selectedUsers = await userService.getUserByField({ [key]: value[key] })
  if (!selectedUsers) {
    throw new ApiError(404, 'user not found')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: selectedUsers,
  })
})

const deleteUserById = catchAsync(async (req, res, next) => {
  const deletedUser = await userService.deleteUserById(req.params.id)
  if (!deletedUserById) throw new ApiError(304, 'Cannot delete')
  res.status(202).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
  })
})

const createUser = catchAsync(async (req, res, next) => {
  const newUser = await userService.createUser(req.body)
  await newUser.save()
  if (!newUser) throw new ApiError(422, 'Invalid request')
  res.status(201).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'user successfully created',
  })
})
const uploadPhoto = catchAsync(async (req, res, next) => {
  const uploader = async (path) => await uploadfile(path, 'BOOST')
  const file = req.file
  const { userId } = req.body
  if (!file) {
    throw new ApiError(501, 'Not implemented !!')
  }
  const { path } = file
  const newPath = await uploader(path)
  const user = await userService.getUserById(userId)
  if (!user) {
    throw new ApiError(404, 'Not found user !!')
  }
  await userService.updateUserById(userId, {
    avatar: {
      public_id: newPath.public_id,
      url: newPath.url,
    },
  })
  res.status(201).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: newPath,
  })
})
const removePhoto = catchAsync(async (req, res, next) => {
  const { userId, public_id } = req.body
  const user = await userService.getUserById(userId)
  if (!user) throw new ApiError(404, 'Not found user')

  const { avatar, ...rest } = user
  const { result } = await removefile(public_id)
  await userService.updateUserById(userId, rest)
  res.status(202).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    result: result,
  })
})

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByField,
  createUser,
  deleteUserById,
  removePhoto,
  uploadPhoto,
}
