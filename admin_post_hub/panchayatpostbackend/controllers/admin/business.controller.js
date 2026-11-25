const catchAsync = require('../../utils/catchAsync');
const { businessService } = require('../../services/admin')

const all = catchAsync(async (req, res) => {
    const result = await businessService.all(req.query.id);
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await businessService.create(req.body, req.files);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await businessService.update(req.body, req.files);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await businessService.remove(req.body);
    await res.status(result.status).send(result)
});



module.exports = {
    all, create, remove, update,
};