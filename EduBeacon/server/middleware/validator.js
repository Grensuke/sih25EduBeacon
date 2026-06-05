const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ 
      message: 'Validation Error', 
      errors: errorMessages 
    });
  }
  
  next();
};

const authSchemas = {
  adminRegister: Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required'
    }),
    organizationName: Joi.string().trim().required().messages({
      'string.empty': 'Organization name is required'
    })
  }),
  
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  })
};

module.exports = { validate, authSchemas };
