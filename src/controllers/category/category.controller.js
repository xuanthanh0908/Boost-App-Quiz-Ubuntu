const catchAsync = require('../../utils/catchAsync')
const { categoryService } = require('../../services')
const ApiError = require('../../utils/ApiError')
const User = require('../../models/user.model')

/**
 * Get the category from the privided id
 */
const getCate = catchAsync(async (req, res, next) => {
  const cate = categoryService.getCateById(req.params.id)
  if (Object.keys(cate) === 0) {
    res.status(204).json({
      success: 'No content',
      totalTimeInMs: `${Date.now() - req.startTime} ms`,
    })
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: cate,
  })
})

const getCategoryByName = catchAsync(async (req, res, next) => {
  const query = req.query.cate
  if (!query) {
    throw new ApiError(404, 'No query found !!')
  }
  const getQuery = await categoryService.getCategoryByName(query)
  if (!getQuery) {
    throw new ApiError(404, 'No category found !!')
  }
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: getQuery,
  })
})

const getAllCategories = catchAsync(async (req, res, next) => {
  const findAll = await categoryService.getAllCate()
  console.log(findAll)
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    data: findAll.length > 0 ? findAll : 'No data',
  })
})

const removeCate = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const findCate = await categoryService.getCateById(id)
  if (!findCate) {
    throw new ApiError(404, 'Category not found !!')
  }
  await categoryService.removeCateById(id)
  res.status(200).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'Category has been deleted !',
  })
})

const addNewCate = catchAsync(async (req, res, next) => {
  const { createdBy } = req.body
  const user = await User.findById(createdBy)
  if (!user) {
    throw new ApiError(404, 'User not found !!')
  }
  await categoryService.addCate(req.body)
  res.status(201).json({
    success: true,
    totalTimeInMs: `${Date.now() - req.startTime} ms`,
    message: 'Category has been created !',
  })
})

module.exports = {
  getCate,
  addNewCate,
  removeCate,
  getAllCategories,
  getCategoryByName,
}
