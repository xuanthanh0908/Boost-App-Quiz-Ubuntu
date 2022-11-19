const mongoose = require('mongoose')
const validator = require('validator')

const categorySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  category: {
    type: String,
    require: true,
    min: 3,
    max: 30,
  },
  subCategories: {
    type: Array,
    default: [],
  },
})

module.exports = mongoose.model('categories', categorySchema)
