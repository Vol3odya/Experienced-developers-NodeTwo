import Joi from "joi";

export const addWaterValidation = Joi.object({
    date: Joi.date().iso().required().messages({
      'date.format': '"Date" must be a valid ISO date (YYYY-MM-DDTHH:mm:ss.sssZ)',
      'any.required': '"Date" is required',
    }),
    waterVolume: Joi.number().min(1).max(5000).required().messages({
      'number.min': '"Water Volume" must be at least 1 ml',
      'number.max': '"Water Volume" cannot exceed 5000 ml',
      'any.required': '"Water Volume" is required',
    }),
  });

  export const updateWaterValidation = Joi.object({
    date: Joi.date().iso().required().messages({
      'date.format': '"Date" must be a valid ISO date (YYYY-MM-DDTHH:mm:ss.sssZ)',
      'any.required': '"Date" is required',
    }),
    waterVolume: Joi.number().min(1).max(5000).required().messages({
      'number.min': '"Water Volume" must be at least 1 ml',
      'number.max': '"Water Volume" cannot exceed 5000 ml',
      'any.required': '"Water Volume" is required',
    }),
  });




