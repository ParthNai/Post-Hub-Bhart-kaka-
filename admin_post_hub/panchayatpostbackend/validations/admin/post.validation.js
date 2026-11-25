const Joi = require('joi');
const { objectId } = require('../custom.validation');

const create = (data) => {
    const schema = Joi.object({
        postName: Joi.string().required().label('Post Name'),
        categoryId: Joi.string().custom(objectId).label('Category'),
        subcategoryId: Joi.string().custom(objectId).label('Subcategory'),
    }).unknown();
    return schema.validate(data);
}

module.exports = {
    create,
};
