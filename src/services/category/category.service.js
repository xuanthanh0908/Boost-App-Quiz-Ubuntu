const { Category } = require('../../models')
const ApiError = require('../../utils/catch/ApiError')

/**
 *
 * @param {*} id
 * @returns
 */
const getCateById = async (id) => {
  return await Category.findById(id)
}

const getAllCate = async () => {
  return await Category.find()
}

const getCategoryByName = async (name) => {
  return await Category.findOne({
    subCategories: { $in: name },
  })
}

/**
 *
 * @param {*} fields
 * @returns
 * Find category from privided fields
 */
const getCateByFields = async (fields) => {
  return await Category.findOne(fields)
}

/**
 *
 * @param {*} cateBody
 * @returns
 */
const addCate = async (cateBody) => {
  const addedCate = await Category.create(cateBody)
  return addedCate
}

/**
 *
 * @param {*} id
 * @returns
 */
const removeCateById = async (id) => {
  return await Category.findByIdAndDelete(id)
}

module.exports = {
  getCateById,
  addCate,
  getCateByFields,
  removeCateById,
  getAllCate,
  getCategoryByName,
}
