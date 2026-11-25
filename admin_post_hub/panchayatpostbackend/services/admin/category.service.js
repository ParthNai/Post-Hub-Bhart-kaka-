const httpStatus = require("http-status");
const { Category } = require("../../models");

const all = async (status) => {
  try {
    const categories = await Category.aggregate([
      { $match: status },
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "categoryId",
          as: "subcategories",
        },
      },
      {
        $addFields: {
          totalSubcategories: { $size: "$subcategories" }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    return {
      status: httpStatus.OK,
      data: categories,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const create = async (data) => {
  try {
    await Category.create(data);
    return { status: httpStatus.OK, message: "Category Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await Category.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    return { status: httpStatus.OK, message: "Category Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await Category.findByIdAndDelete(data._id || data.id);
    return { status: httpStatus.OK, message: "Category Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove
};
