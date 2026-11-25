const catchAsync = require("../../utils/catchAsync");
const userService = require("../../services/admin/user.service");

const appUsers = catchAsync(async (req, res) => {
  const result = await userService.appUsers(req.query);
  await res.status(result.status).send(result);
});

const appUserExport = catchAsync(async (req, res) => {
  const result = await userService.appUserExcel(req,res);
  // await res.status(result.status).send(result);
  return result
});


const adminUsers = catchAsync(async (req, res) => {
  const result = await userService.adminUsers(req.query);
  await res.status(result.status).send(result);
});

const subscribedUsers = catchAsync(async (req, res) => {
  const result = await userService.subscribedUsers(req.query);
  await res.status(result.status).send(result);
});

const create = catchAsync(async (req, res) => {
  const result = await userService.create(req.body);
  await res.status(result.status).send(result);
});

const update = catchAsync(async (req, res) => {
  const result = await userService.update(req.body);
  await res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
  const result = await userService.remove(req.body);
  await res.status(result.status).send(result);
});

const assignSubscription = catchAsync(async (req, res) => {
  const result = await userService.assignSubscription(req.body);
  await res.status(result.status).send(result);
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await userService.deleteSubscription(req.body);
  await res.status(result.status).send(result);
});

const addBusiness = catchAsync(async (req, res) => {
  const result = await userService.addBusiness(req.body, req.files);
  await res.status(result.status).send(result);
});

const addGrampanchayat = catchAsync(async (req, res) => {
  const result = await userService.addGrampanchayat(req.body, req.files);
  await res.status(result.status).send(result);
});

const addElection = catchAsync(async (req, res) => {
  const result = await userService.addElection(req.body, req.files);
  await res.status(result.status).send(result);
});

const getUserInfo = catchAsync(async (req, res) => {
  // console.log("getUserInfo", req.query);

  //   return {};
  const result = await userService.getAppUserInfo(req.query.userId);
  await res.status(result.status).send(result);
  //   await res.status(200).send({});
});

const getUserPin = catchAsync(async (req, res) => {
  const result = await userService.getUserPin(req.query.userId);
  await res.status(result.status).send(result);
});

module.exports = {
  appUsers,
  adminUsers,
  subscribedUsers,
  create,
  remove,
  update,
  assignSubscription,
  addBusiness,
  addGrampanchayat,
  addElection,
  deleteSubscription,
  getUserInfo,
  appUserExport,
  getUserPin,
};
