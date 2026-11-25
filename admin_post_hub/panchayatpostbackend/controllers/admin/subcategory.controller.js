const catchAsync = require('../../utils/catchAsync');
const { subcategoryService } = require('../../services/admin')

const all = catchAsync(async (req, res) => {
    const result = await subcategoryService.all(req.query.id);
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await subcategoryService.create(req.body);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await subcategoryService.update(req.body);
    await res.status(result.status).send(result)
});

const getImages = catchAsync(async (req, res) => {
    const result = await subcategoryService.getImages(req.query.id);
    await res.status(result.status).send(result)
});

const uploadImages = catchAsync(async (req, res) => {
    const result = await subcategoryService.uploadImages(req.body, req.files);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await subcategoryService.remove(req.body);
    await res.status(result.status).send(result)
});

const notify = catchAsync(async (req, res) => {
    const result = await subcategoryService.notify(req.body);
    await res.status(result.status).send(result);
});

module.exports = {
    all, create, remove, update, uploadImages, getImages, notify
};