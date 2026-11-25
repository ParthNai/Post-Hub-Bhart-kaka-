const catchAsync = require('../../utils/catchAsync');
const { frameService } = require('../../services/admin')

const all = catchAsync(async (req, res) => {
    const result = await frameService.all();
    await res.status(result.status).send(result)
});

const uploadframe = catchAsync(async (req, res) => {
    const result = await frameService.uploadframe(req.body, req.files);
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await frameService.create(req.body);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await frameService.update(req.body);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await frameService.remove(req.query);
    await res.status(result.status).send(result)
});

module.exports = {
    all, create, remove, update, uploadframe
};