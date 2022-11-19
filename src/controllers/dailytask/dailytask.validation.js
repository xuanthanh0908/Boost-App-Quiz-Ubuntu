const Joi = require('joi')

const dailyTask = Joi.object().keys({
  userId: Joi.string().required(),
  categories: Joi.array().items(
    Joi.object.keys({
      category: Joi.string().valid(['Math', 'Physics', 'History']),
    }),
  ),
  hashtags: Joi.array().items(Joi.string()),
  receivedDate: Joi.number(),
  finishedTasks: Joi.array().items(
    Joi.object.keys({
      category: Joi.string().valid(['Math', 'Physics', 'History']),
    }),
  ),
  penddingTasks: Joi.array().items(
    Joi.object.keys({
      category: Joi.string().valid(['Math', 'Physics', 'History']),
    }),
  ),
})

module.exports = {
  dailyTask,
}
