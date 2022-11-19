const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    displayname: {
      type: String,
      trim: true,
    },
    uid: {
      type: String,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Prefered not to choose'],
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email')
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      private: true, // used by the toJSON plugin
    },
    phoneNumber: {
      type: Number,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'mode'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      public_id: {
        type: String,
        default: '0903e1548162c243314fbcb8b34633dd_huaynn',
      },
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/di4m7zawx/image/upload/v1667582596/BOOST/0903e1548162c243314fbcb8b34633dd_huaynn.jpg',
      },
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'users',
      default: [],
    },
    code: {
      type: String,
      minlength: 3,
      maxlength: 6,
    },
    typeLogin: {
      type: String,
      default: 'email',
      enum: ['google', 'facebook', 'email'],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('users', userSchema)
