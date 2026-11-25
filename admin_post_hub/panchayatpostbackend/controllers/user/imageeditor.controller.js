const catchAsync = require("../../utils/catchAsync");
const { imageEditorService } = require("../../services/user");

const all = catchAsync(async (req, res) => {
  const result = await imageEditorService.all(req.query, req.userId, req.userType);
  await res.status(result.status).send(result);
});

module.exports = {
  all,
};
