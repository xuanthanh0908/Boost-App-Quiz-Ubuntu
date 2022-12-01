const ApiError = require('../utils/catch/ApiError')
const catchAsync = require('../utils/catch/catchAsync')

/**
 *
 * @param {*} validator a Joi validator
 * @param {*} req the request
 * Check if the request parameters and body match the validation
 */
const validateInput = (validator) =>
  catchAsync(async (req, res, next) => {
    if (Object.keys(req.params) != 0) {
      const result = validator.param.validate(req.params)
      if (result.error) throw new ApiError(422, 'Invalid Parameter')
    }
    const result = validator.body.validate(req.body)
    if (result.error) throw new ApiError(422, 'Invalid Input')
    next()
  })

module.exports = validateInput
