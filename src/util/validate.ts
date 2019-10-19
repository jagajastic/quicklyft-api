import Joi from 'joi';
import { User, Code } from '../types';

export const validateUserPhoneNumber = (user: User) => {
  const userSchema = {
    phone: Joi.string()
      .min(11)
      .max(15)
      .required(),
  };

  return Joi.validate(user, userSchema);
};

export const validateCode = (code: Code) => {
  const codeSchema = {
    code: Joi.string()
      .max(8)
      .required(),
  };

  return Joi.validate(code, codeSchema);
};
