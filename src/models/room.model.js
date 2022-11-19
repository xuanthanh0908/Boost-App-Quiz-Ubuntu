const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users'
    },    
    roomId: {
        type: String,
        unique: true
    }
})
  
  module.exports = mongoose.model('rooms', roomSchema)