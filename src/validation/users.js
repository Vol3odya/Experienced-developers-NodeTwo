import Joi from 'joi';
import { genderList } from '../constants/users.js';

export const updateUsersSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).max(15),
  outdatePassword: Joi.string(),
  name: Joi.string().max(20),
  gender: Joi.string()
    .valid(...genderList)
    .default('male'),
  waterRate: Joi.number().min(1000).max(15000),
  photo: Joi.string().uri(),
});

export const updatePhotoSchema = Joi.object({
  photo: Joi.string().uri(),
});

export const updateWateRateSchema = Joi.object({
  dailyNorma: Joi.number().min(1000).max(15000).messages({
    'number.base': '"waterRate" must be a number',
    'number.min': '"waterRate" must be at least 1000',
    'number.max': '"waterRate" must not exceed 15000',
  }),
});
