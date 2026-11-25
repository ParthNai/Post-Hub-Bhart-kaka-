const catchAsync = require('../../utils/catchAsync');
const { templateService } = require('../../services/user');

const all = catchAsync(async (req, res) => {
    const result = await templateService.all(req.query);
    await res.status(result.status).send(result)
});


module.exports = {
    all,
};