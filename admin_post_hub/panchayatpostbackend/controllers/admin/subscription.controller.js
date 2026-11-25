const catchAsync = require('../../utils/catchAsync');
const { subscriptionService } = require('../../services/admin');

const all = catchAsync(async (req, res) => {
    const result = await subscriptionService.all();
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await subscriptionService.create(req.body);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await subscriptionService.update(req.body);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await subscriptionService.remove(req.body);
    await res.status(result.status).send(result)
});



module.exports = {
    all, create, remove, update
};