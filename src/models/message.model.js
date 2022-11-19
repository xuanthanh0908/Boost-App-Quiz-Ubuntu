const mongoose = require('mongoose')
const validator = require('validator')

const messageShema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    receiver: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'users',
      required: true,
    },
    content: {
      type: String
    }
  }
)

module.exports = mongoose.model('messages', messageShema)
