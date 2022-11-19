const dotenv = require('dotenv')
const path = require('path')
const Joi = require('joi')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(9000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET_ACCESSTOKEN: Joi.string()
      .required()
      .description('JWT access token secret key'),
    JWT_SECRET_REFRESHTOKEN: Joi.string()
      .required()
      .description('JWT refresh token secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(15)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    FRONTEND_URL: Joi.string().description('frontend base url'),
    CLOUD_NAME: Joi.string().description('Cloud name in dashboard'),
    CLOUDINARY_API_KEY: Joi.number()
      .default(20)
      .description('Api key in dashboard'),
    CLOUDINARY_API_SECRET: Joi.string().description('Api secret in dashboard'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      //useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secretAccessToken: envVars.JWT_SECRET_ACCESSTOKEN,
    secretRefreshToken: envVars.JWT_SECRET_REFRESHTOKEN,
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  cloudinary: {
    cloudname: envVars.CLOUD_NAME,
    apikey: envVars.CLOUDINARY_API_KEY,
    apisecret: envVars.CLOUDINARY_API_SECRET,
  },

  FRONTEND_URL: envVars.FRONTEND_URL,
}
