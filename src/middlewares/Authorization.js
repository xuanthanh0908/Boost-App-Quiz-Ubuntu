const { getUserById } = require('../services/user/user.service')
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')

const authPage = (permission) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.user
    const user = await getUserById(id)
    if (!user) {
      throw new ApiError(404, 'User not found !!')
    }
    const { role } = user
    if (!role) throw new ApiError(401, 'You are not authenticated !!');
    if (!permission.includes(role)) {
      throw new ApiError(403, `You are not authorization !!`)
    }
    next()
  })

module.exports = authPage
