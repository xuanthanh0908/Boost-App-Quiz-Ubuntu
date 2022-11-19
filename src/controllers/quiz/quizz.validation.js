const Joi = require('joi')

const validateUpdate = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    createdBy: Joi.string(),
    questionTitle: Joi.string().required(),
    questionAnswer: Joi.object().keys({
      listVi: Joi.array().items(Joi.string()),
      listEn: Joi.array().items(Joi.string()),
      listFr: Joi.array().items(Joi.string()),
      listDe: Joi.array().items(Joi.string()),
    }),
    hashtags: Joi.array().items(Joi.string()),
    correctOption: Joi.object().keys({
      optionVi: Joi.array().items(Joi.string()),
      optionEn: Joi.array().items(Joi.string()),
      optionFr: Joi.array().items(Joi.string()),
      optionDe: Joi.array().items(Joi.string()),
    }),
    category: Joi.string().valid('Math', 'Physics', 'History'),
    report: Joi.object().keys({
      userId: Joi.string(),
      content: Joi.string().min(10).max(250),
    }),
  }),
}

const validateAdd = {
  body: Joi.object().keys({
    createdBy: Joi.any(),
    questionTitle: Joi.string().required(),
    questionAnswer: Joi.object().keys({
      listsVi: Joi.array().items(Joi.string()),
      listsEn: Joi.array().items(Joi.string()),
      listsFr: Joi.array().items(Joi.string()),
      listsDe: Joi.array().items(Joi.string()),
    }),
    hashtags: Joi.array().items(Joi.string()),
    correctOption: Joi.object().keys({
      optionVi: Joi.array().items(Joi.string()),
      optionEn: Joi.array().items(Joi.string()),
      optionFr: Joi.array().items(Joi.string()),
      optionDe: Joi.array().items(Joi.string()),
    }),
    category: Joi.string().valid('Math', 'Physics', 'History'),
  }),
}

module.exports = {
  validateUpdate,
  validateAdd,
}
