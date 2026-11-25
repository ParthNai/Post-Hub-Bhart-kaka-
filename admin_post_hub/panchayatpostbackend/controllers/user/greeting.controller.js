const catchAsync = require('../../utils/catchAsync');
const { greetingService } = require('../../services/user');

const all = catchAsync(async (req, res) => {
    const result = await greetingService.all(req.query.id);
    await res.status(result.status).send(result)
});



module.exports = {
    all
};