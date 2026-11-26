const catchAsync = require('../../utils/catchAsync');
const { festivalService } = require('../../services/user');

const all = catchAsync(async (req, res) => {
    const result = await festivalService.all();
    await res.status(result.status).send(result)
});

const checkAccess = catchAsync(async (req, res) => {
    const result = await festivalService.checkAccess(req.params.id);
    await res.status(result.status).send(result);
});

module.exports = {
    all,
    checkAccess,
};