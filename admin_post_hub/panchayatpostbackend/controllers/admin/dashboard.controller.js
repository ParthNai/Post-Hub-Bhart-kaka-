const catchAsync = require("../../utils/catchAsync");
const { dashboardService } = require("../../services/admin");
const index = catchAsync(async (req, res) => {
  const result = await dashboardService.all();
  await res.status(result.status).send(result);
});

module.exports = {
  index,
};
