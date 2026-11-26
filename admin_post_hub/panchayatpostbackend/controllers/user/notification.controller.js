const catchAsync = require("../../utils/catchAsync");
const { notificationService } = require("../../services/user");

const sendNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.sendNotifications(req.body || {});
  await res.status(result.status).send(result);
});

module.exports = {
  sendNotifications,
};
