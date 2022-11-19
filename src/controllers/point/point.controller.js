const catchAsync = require('../../utils/catchAsync')
const pointService = require('../../services')
const ApiError = require('../../utils/ApiError')
const User = require('../../models/user.model')

// getPoints from the parameter of the URI
const getPointsByUserId = async (req, res, next) => {
  const userId = req.params.userId
  const userPoints = await pointService.getPointsByField({ userId: userId })
  if (!userPoints) {
    throw new ApiError(404, 'No points of this user found!')
  }
  const { totalPoints, points } = userPoints
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: {
      totalPoints,
      points,
    },
  })
}

// Update the points of a given user via its ID
const updatePoints = async (req, res, next) => {
  const userId = req.params.userId
  const updatedPoints = await pointService.updatePointsByField(userId, req.body)
  if (!updatedPoints) {
    throw new ApiError(404, 'User not found!')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: updatedPoints,
  })
}

//
const increasePoint = async (req, res, next) => {
  const { amountPoint, userId } = req.body
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, 'User not found!')
  }
  const increasePoint = await pointService.updatePointsByField(userId, {
    $inc: {
      totalPoints: amountPoint,
    },
  })
  res.status(202).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: increasePoint,
  })
}
module.exports = {
  getPointsByUserId,
  updatePoints,
  increasePoint,
}
