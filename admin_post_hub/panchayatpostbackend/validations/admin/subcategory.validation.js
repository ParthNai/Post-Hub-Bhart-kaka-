const Joi = require('joi');
const { objectId } = require('../custom.validation');

const create = (data) => {
    const schema = Joi.object({
        categoryId: Joi.string().custom(objectId).label('Category'),
        subcategoryName: Joi.string().required().label('Subcategory Name'),
        // subcategoryImage: Joi.string().required().label('Subcategory Image')
    }).unknown();
    return schema.validate(data);
}

module.exports = {
    create,
};
