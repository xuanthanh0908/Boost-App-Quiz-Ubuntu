const mongoose = require('mongoose')
const validator = require('validator')

const quizSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    questionTitle: {
      listsVi: {
        type: String,
      },
      listsEn: {
        type: String,
      },
      listsFr: {
        type: String,
      },
      listsDe: {
        type: String,
      },
    },
    questionAnswer: {
      listsVi: {
        type: [String],
      },
      listsEn: {
        type: [String],
      },
      listsFr: {
        type: [String],
      },
      listsDe: {
        type: [String],
      },
    },
    hashtags: {
      type: [String],
    },
    correctOption: {
      optionVi: {
        type: String,
      },
      optionEn: {
        type: String,
      },
      optionFr: {
        type: String,
      },
      optionDe: {
        type: String,
      },
    },
    category: {
      type: String,
      required: true,
    },
    report: {
      userId: mongoose.Schema.Types.ObjectId,
      content: {
        type: String,
        min: 10,
        max: 250,
      },
    },
    type: {
      type: String,
      enum: ['text', 'image', 'fill', 'select'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('quizs', quizSchema)
