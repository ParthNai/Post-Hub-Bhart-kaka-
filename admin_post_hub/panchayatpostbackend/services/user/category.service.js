const httpStatus = require("http-status");
const { Category, Subcategory, Image } = require("../../models");

const all = async (id) => {
  try {
    const cat = await Category.findById(id)
    const subs = await Subcategory.find({ categoryId: cat._id, status: true }).sort({ createdAt: 1 })

    const images = await Promise.all(subs.map(async (s) => {

      const subimages =
        await Image.find({ subcategoryId: s.id || s._id })

      return { ...s._doc, images: subimages }
    }))
    const catData = {
      ...cat._doc,
      subCategories: images
    }
    return {
      status: httpStatus.OK,
      data: catData
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const getSubcategory = async (id) => {
  try {
    const subimages = await Image.find({ subcategoryId: id })
    return {
      status: httpStatus.OK,
      data: subimages
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

module.exports = {
  all, getSubcategory
};
