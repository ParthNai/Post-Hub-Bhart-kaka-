const catchAsync = require('../../utils/catchAsync');
const { customCategoryService } = require('../../services/admin')

const all = catchAsync(async (req, res) => {
    const result = await customCategoryService.all(req.query.id);
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await customCategoryService.create(req.body);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await customCategoryService.update(req.body);
    await res.status(result.status).send(result)
});

const getImages = catchAsync(async (req, res) => {
    const result = await customCategoryService.getImages(req.query.id);
    await res.status(result.status).send(result)
});

const uploadImages = catchAsync(async (req, res) => {
    const result = await customCategoryService.uploadImages(req.body, req.files);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await customCategoryService.remove(req.body);
    await res.status(result.status).send(result)
});

const notify = catchAsync(async (req, res) => {
    const result = await customCategoryService.notify(req.body);
    await res.status(result.status).send(result);
});

module.exports = {
    all, create, remove, update, uploadImages, getImages, notify
};