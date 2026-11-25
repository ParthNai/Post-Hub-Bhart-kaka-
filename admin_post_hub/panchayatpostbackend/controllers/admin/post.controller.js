const catchAsync = require('../../utils/catchAsync');
const { postService } = require('../../services/admin')

const all = catchAsync(async (req, res) => {
    const result = await postService.all();
    await res.status(result.status).send(result)
});

const create = catchAsync(async (req, res) => {
    const result = await postService.create(req.body, req.files);
    await res.status(result.status).send(result)
});

const update = catchAsync(async (req, res) => {
    const result = await postService.update(req.body, req.files);
    await res.status(result.status).send(result)
});

const remove = catchAsync(async (req, res) => {
    const result = await postService.remove(req.body);
    await res.status(result.status).send(result)
});

const festivalPost = catchAsync(async (req, res) => {
    const result = await postService.festivalPost();
    await res.status(result.status).send(result)
});

const createFestivalPost = catchAsync(async (req, res) => {
    const result = await postService.createFestivalPost(req.body);
    await res.status(result.status).send(result)
});

const updateFestivalPost = catchAsync(async (req, res) => {
    const result = await postService.updateFestivalPost(req.body);
    await res.status(result.status).send(result)
});


const removeFestivalPost = catchAsync(async (req, res) => {
    const result = await postService.removeFestivalPost(req.query._id);
    await res.status(result.status).send(result)
});



module.exports = {
    all, create, remove, update, festivalPost, createFestivalPost, updateFestivalPost, removeFestivalPost
};