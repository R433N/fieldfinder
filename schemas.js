const Joi = require('joi')
   const fieldSchema = Joi.object({
       field: Joi.object({
           title: Joi.string().required(),
           location: Joi.string().required(),
           image: Joi.string().required(),
           fieldType: Joi.string().required(),
           phone: Joi.number().required()
       }).required()


   })

module.exports.fieldSchema = fieldSchema;