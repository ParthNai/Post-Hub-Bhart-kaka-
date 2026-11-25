const catchAsync = require('../../utils/catchAsync');
const { themeSampleService } = require('../../services/admin');

const all = catchAsync(async (req, res) => {
    const result = await themeSampleService.all();
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await themeSampleService.create(req.body, req.files);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await themeSampleService.update(req.body, req.files);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await themeSampleService.remove(req.body);
    await res.status(result.status).send(result)
});



module.exports = {
    all, create, remove, update
};