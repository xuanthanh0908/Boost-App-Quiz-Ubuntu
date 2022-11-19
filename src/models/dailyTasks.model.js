const mongoose = require('mongoose')

const dailytaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    categories: {
      type: [String],
      required: true,
      min: 4,
      max: 10,
      default: [],
    },
    receivedDate: {
      type: Number,
      default: Date.now(),
    },
    finishedTasks: [String],
    penddingTasks: [String],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('dailytasks', dailytaskSchema)
