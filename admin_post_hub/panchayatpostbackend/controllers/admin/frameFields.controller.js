const catchAsync = require('../../utils/catchAsync');
const { frameFieldsService } = require('../../services/admin')

const all = catchAsync(async (req, res) => {
    const result = await frameFieldsService.all();
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await frameFieldsService.create(req.body, req.files);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await frameFieldsService.update(req.body, req.files);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await frameFieldsService.remove(req.query);
    await res.status(result.status).send(result)
});

module.exports = {
    all, create, remove, update,
};