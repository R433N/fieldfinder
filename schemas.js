const Joi = require('joi')
   const fieldSchema = Joi.object({
       field: Joi.object({
           title: Joi.string().required(),
           location: Joi.string().required(),
           //image: Joi.string().required(),
           fieldType: Joi.string().required(),
           phone: Joi.string().required()
       }).required(),
       deleteImages: Joi.array()


   })

module.exports.fieldSchema = fieldSchema;


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})