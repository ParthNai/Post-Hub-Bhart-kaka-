const catchAsync = require("../../utils/catchAsync");
const { festivalService } = require("../../services/admin");

const all = catchAsync(async (req, res) => {
  const result = await festivalService.all();
  await res.status(result.status).send(result);
});

const create = catchAsync(async (req, res) => {
  const result = await festivalService.create(req.body, req.files);
  await res.status(result.status).send(result);
});

const update = catchAsync(async (req, res) => {
  const result = await festivalService.update(req.body, req.files);
  await res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
  const result = await festivalService.remove(req.body);
  await res.status(result.status).send(result);
});

const notify = catchAsync(async (req, res) => {
  const result = await festivalService.notify(req.body);
  await res.status(result.status).send(result);
});

module.exports = {
  all,
  create,
  remove,
  update,
  notify
};
