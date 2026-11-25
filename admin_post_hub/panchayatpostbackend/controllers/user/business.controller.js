const catchAsync = require('../../utils/catchAsync');
const { businessService } = require('../../services/user')

const all = catchAsync(async (req, res) => {
    const result = await businessService.all(req.userId);
    await res.status(result.status).send(result)
});

const activate = catchAsync(async (req, res) => {
    const result = await businessService.activate(req.userId, req.body);
    await res.status(result.status).send(result)
});

const getSingleBusiness = catchAsync(async (req, res) => {
    const result = await businessService.getSingleBusiness(req.query.id);
    await res.status(result.status).send(result)
});

const uploadLogo = catchAsync(async (req, res) => {
    const result = await businessService.uploadLogo(req.query.id);
    await res.status(result.status).send(result)
});

module.exports = {
    all, activate, getSingleBusiness, uploadLogo
};