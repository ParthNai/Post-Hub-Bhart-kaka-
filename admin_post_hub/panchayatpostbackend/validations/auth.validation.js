const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    name: Joi.string().trim().min(2).max(100).required(),
    mobile: Joi.string().pattern(/^\d{10}$/).required(),
    pin: Joi.string().min(1).max(100).required(),
    occupation: Joi.string().trim().min(1).max(100).required(),
    village: Joi.string().trim().max(100).allow(''),
    taluka: Joi.string().trim().max(100).allow(''),
    district: Joi.string().trim().max(100).allow(''),
  }),
};

const pinLogin = {
  body: Joi.object().keys({
    mobile: Joi.string().allow('').optional(),
    username: Joi.string().allow('').optional(),
    otp: Joi.string().min(1).max(100).optional(),
    pin: Joi.string().min(1).max(100).optional(),
    password: Joi.string().min(1).max(100).optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const sendloginotp = {
  body: Joi.object().keys({
    mobile: Joi.number().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

module.exports = {
  register,
  pinLogin,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendloginotp
};
