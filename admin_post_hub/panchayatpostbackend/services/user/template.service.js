const httpStatus = require("http-status");
const { Category, Subcategory } = require("../../models");
const Festival = require("../../models/festival.model");

const all = async (data) => {
  try {
    let template
    if (data.subcategoryId) {
      const subcategory = await Subcategory.findById(data.subcategoryId)
      template = subcategory.subcategoryImages
    } else if (data.festivalId) {
      const festival = await Festival.findById(data.festivalId)
      template = festival.festivalImages
    }
    return {
      status: httpStatus.OK,
      data: { template: template, frames: [] },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

module.exports = {
  all,
};
