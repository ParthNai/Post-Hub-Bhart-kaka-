const catchAsync = require('../../utils/catchAsync');
const { festivalService } = require('../../services/user');

const all = catchAsync(async (req, res) => {
    const result = await festivalService.all();
    await res.status(result.status).send(result)
});


module.exports = {
    all
};