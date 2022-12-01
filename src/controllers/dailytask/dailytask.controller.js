const ApiError = require('../../utils/catch/ApiError')
const catchAsync = require('../../utils/catch/catchAsync')
const dailyService = require('../../services/dailytask/dailytask.service')
const User = require('../../models/user.model')
const { checkNullInput } = require('../../utils/catch/checkExitsField')
const lodash = require('lodash')

// get daily task by userId
const getdailyTask = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  const dailyTask = await dailyService.getTaskByUserId(userId)
  if (!dailyTask) {
    throw new ApiError(404, `Not found daily task `)
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: dailyTask,
  })
})
// add daily task by userId
const adddailyTask = catchAsync(async (req, res, next) => {
  checkNullInput(req.body, ['userId', 'categories', 'receivedDate'])
  const user = await User.findById(req.body.userId)
  if (!user) {
    throw new ApiError(404, `User not found ! `)
  }
  const task = await dailyService.addTask(req.body)
  await task.save()
  res.status(201).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'task has been created !',
  })
})
// update daily task by userId
const updatedailyTask = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  checkNullInput(req.body, ['categories', 'receivedDate'])
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404, `User not found !`)
  }
  await dailyService.updateTask(userId, req.body)
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'task has been updated !',
  })
})
// remove daily task by userId
const removedailyTask = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  const exitstask = await dailyService.getTaskByUserId(userId)
  if (!exitstask) {
    throw new ApiError(501, `Not Implemented!`)
  }
  await dailyService.removeTask(userId)
  res.status(202).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'task has been deleted !',
  })
})
// random subcategory into user - each user has own daily task
const randomCategoryTasks = catchAsync(async (req, res, next) => {
  // fake list categories
  const { limit } = req.query
  const fakeCategories = [
    {
      id: 1,
      title: 'html',
    },
    {
      id: 2,
      title: 'css',
    },
    {
      id: 3,
      title: 'javascript',
    },
  ]
  const combineRandom = []
  const fakeTypes_1 = ['solo', 'pvp', 'solo', 'pvp']
  const fakeTypes_2 = ['solo', 'pvp', 'pvp', 'solo']
  const fakeTypes_3 = ['solo', 'pvp', 'pvp', 'pvp']
  const randTypes = [fakeTypes_1, fakeTypes_2, fakeTypes_3]
  let rand = Math.floor(Math.random() * 3)
  for (let i = 0; i < limit; i++) {
    const randomCates = Math.floor(Math.random() * fakeCategories.length)
    combineRandom.push({
      category: fakeCategories[randomCates].title,
      mode: randTypes[rand][i],
    })
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: combineRandom,
  })
})

module.exports = {
  getdailyTask,
  adddailyTask,
  updatedailyTask,
  removedailyTask,
  randomCategoryTasks,
}
