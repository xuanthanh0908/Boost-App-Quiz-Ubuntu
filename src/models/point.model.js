const mongoose = require('mongoose')
const validator = require('validator')

const pointSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    points: {
      point: Number,
      type: {
        type: String,
        enum: ['daily', 'solo', 'dual', 'gift'],
      },
      totalTop: Number,
      totalStreak: Number,
      recieveDate: {
        type: Date,
        default: Date.now,
      },
    },
    usage: {
      type: {
        type: String,
        enum: ['item', 'gift', ''],
        point: {
          type: Number,
          min: 10,
          max: 500,
        },
        usageDate: {
          type: Date,
          default: Date.now,
        },
      },
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('points', pointSchema)
