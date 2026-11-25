const catchAsync = require('../../utils/catchAsync');
const { categoryService } = require('../../services/admin');
const { statusCheck } = require('../../utils/functions');

const all = catchAsync(async (req, res) => {
    const result = await categoryService.all(statusCheck(req.query.status));
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await categoryService.create(req.body);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await categoryService.update(req.body);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await categoryService.remove(req.body);
    await res.status(result.status).send(result)
});



module.exports = {
    all, create, remove, update
};