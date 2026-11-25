const catchAsync = require("../../utils/catchAsync");
const { exploreService } = require("../../services/user");

const all = catchAsync(async (req, res) => {
  const result = await exploreService.all(req.userId);
  //   console.log("expore", result);

  await res.status(result.status).send(result);
});

module.exports = {
  all,
};
