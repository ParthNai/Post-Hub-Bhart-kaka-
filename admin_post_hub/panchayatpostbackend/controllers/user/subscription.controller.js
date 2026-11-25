const catchAsync = require('../../utils/catchAsync');
const { subscriptionService } = require('../../services/user');

const all = catchAsync(async (req, res) => {
    const result = await subscriptionService.all(req.userId);
    await res.status(result.status).send(result)
});

const createOrder = catchAsync(async (req, res) => {
    const result = await subscriptionService.createOrder(req.body);
    await res.status(result.status).send(result)
});


const purchase = catchAsync(async (req, res) => {
    const result = await subscriptionService.purchase({ userId: req.userId, data: req.body });
    return res.status(result.status).send(result);
});

module.exports = {
    all, createOrder, purchase
};