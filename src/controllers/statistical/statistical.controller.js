const { User } = require('../../models')
const { userForUserTracking } = require('../../socket/socketHandler')
const catchAsync = require('../../utils/catch/catchAsync')
const getAllNewUser = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query
  const newUser = await User.aggregate([
    {
      $match: {
        ...(startDate &&
          endDate && {
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          }),
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: {
          $sum: 1,
        },
      },
    },
    { $sort: { total: -1 } },
  ])
  if (newUser.length == 0 || !newUser) {
    throw new ApiError(404, 'Not found !!')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: newUser,
  })
})
const getAllNewUserByAge = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query
  const newUser = await User.aggregate([
    {
      $match: {
        ...(startDate &&
          endDate && {
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          }),
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
        age: 1,
      },
    },
    {
      $group: {
        _id: { month: '$month', age: '$age' },
        total: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: '$_id.month',
        age: {
          $push: {
            age: '$_id.age',
            count: '$total',
          },
        },
        total: { $sum: '$total' },
      },
    },
    { $sort: { count: -1 } },
  ])
  if (newUser.length == 0 || !newUser) {
    throw new ApiError(404, 'Not found !!')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: newUser,
  })
})
const getAllNewUserByGender = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query
  const newUser = await User.aggregate([
    {
      $match: {
        ...(startDate &&
          endDate && {
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          }),
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
        gender: 1,
      },
    },
    {
      $group: {
        _id: { month: '$month', gender: '$gender' },
        total: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: '$_id.month',
        gender: {
          $push: {
            gender: '$_id.gender',
            count: '$total',
          },
        },
        total: { $sum: '$total' },
      },
    },
    { $sort: { count: -1 } },
  ])
  if (newUser.length == 0 || !newUser) {
    throw new ApiError(404, 'Not found !!')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: newUser,
  })
})
const getAllOnline = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: userForUserTracking,
  })
})

module.exports = {
  getAllNewUser,
  getAllNewUserByAge,
  getAllNewUserByGender,
  getAllOnline,
}
