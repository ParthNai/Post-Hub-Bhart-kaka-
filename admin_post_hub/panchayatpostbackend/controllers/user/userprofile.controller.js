const catchAsync = require('../../utils/catchAsync');
const { userProfileService } = require('../../services/user');

const updateProfile = catchAsync(async (req, res) => {
    const result = await userProfileService.updateProfile(req.userId, req.body,);
    return res.status(result.status).send(result);
});

const verifyDownload = catchAsync(async (req, res) => {
    const result = await userProfileService.verifyDownload(req.userId);
    return res.status(result.status).send(result);
});

const incrementDownload = catchAsync(async (req, res) => {
    const result = await userProfileService.incrementDownload(req.userId);
    return res.status(result.status).send(result);
});

module.exports = {
    updateProfile, verifyDownload, incrementDownload
};