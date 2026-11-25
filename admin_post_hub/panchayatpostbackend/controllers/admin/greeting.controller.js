const catchAsync = require('../../utils/catchAsync');
const { greetingService } = require('../../services/admin')

const all = catchAsync(async (req, res) => {
    const result = await greetingService.all(req.query.id);
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await greetingService.create(req.body);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await greetingService.update(req.body);
    await res.status(result.status).send(result)
});

const getImages = catchAsync(async (req, res) => {
    const result = await greetingService.getImages(req.query.id);
    await res.status(result.status).send(result)
});

const uploadImages = catchAsync(async (req, res) => {
    const result = await greetingService.uploadImages(req.body, req.files);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await greetingService.remove(req.body);
    await res.status(result.status).send(result)
});



module.exports = {
    all, create, remove, update, uploadImages, getImages
};