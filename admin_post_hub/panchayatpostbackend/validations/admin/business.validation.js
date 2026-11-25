const Joi = require('joi');
const { mobile } = require('../custom.validation');

const create = (data) => {
    const schema = Joi.object({
        businessName: Joi.string().required().label('Business Name'),
        businessEmail: Joi.string().required().email().label('Business Email'),
        businessMobile: Joi.string().custom(mobile).label('Business Mobile'),
        businessWebsite: Joi.string().label('Business Website'),
        businessAddress: Joi.string().label('Business Address'),
        businessLogo: Joi.string().label('Business Logo')
    }).unknown();
    return schema.validate(data);
}

module.exports = {
    create,
};
