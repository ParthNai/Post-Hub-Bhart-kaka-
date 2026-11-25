const catchAsync = require("../../utils/catchAsync");
const { authService } = require("../../services/user");
const { array } = require("joi");

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(result.status).send(result);
});

const checkIfUserExist = catchAsync(async (req, res) => {
  const result = await authService.checkIfUserExist(req.body);
  return res.status(result.status).send(result);
});
const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  return res.status(result.status).send(result);
});

const sendloginotp = catchAsync(async (req, res) => {
  const result = await authService.sendloginotp(req.body);
  return res.status(result.status).send(result);
});

const details = catchAsync(async (req, res) => {
  // console.log("details", req.userId);

  const result = await authService.details(req.userId);
  return res.status(result.status).send(result);
});

const socialLogin = catchAsync(async (req, res) => {
  const result = await authService.socialLogin(req.body);
  return res.status(result.status).send(result);
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return res.status(result.status).send(result);
});

const checkOtp = catchAsync(async (req, res) => {
  const result = await authService.checkOtp(req.body);
  return res.status(result.status).send(result);
});

const changeForgotPassword = catchAsync(async (req, res) => {
  const result = await authService.changeForgotPassword(req.body);
  return res.status(result.status).send(result);
});

module.exports = {
  register,
  login,
  details,
  socialLogin,
  forgotPassword,
  checkOtp,
  changeForgotPassword,
  sendloginotp,
  checkIfUserExist,
};
