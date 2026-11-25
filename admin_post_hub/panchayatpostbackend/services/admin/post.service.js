const httpStatus = require("http-status");
const { Post, Festival, FestivalPost, Image } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");
const { postValidation } = require("../../validations/admin");
const moment = require("moment");

const all = async () => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcategories",
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "postImages.imageId",
          foreignField: "_id",
          as: "images",
        },
      },
      {
        $unwind: "$categories",
      },
      {
        $unwind: "$subcategories",
      },
      {
        $addFields: {
          categoryName: "$categories.categoryName",
          subcategoryName: "$subcategories.subcategoryName",
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    return {
      status: httpStatus.OK,
      data: posts,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data, files) => {
  try {
    const images = await getFilesData(files);
    await Promise.all(
      images.map(async (img) => {
        await Image.create({ ...data, path: img });
      })
    );
    const { error } = postValidation.create(data);
    if (error) {
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    await Post.create({
      ...data,
      isFixedDate: data.isFixedDate != "" ? false : true,
    });
    return { status: httpStatus.OK, message: "Post Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    data.postImages = getFilesData(files);
    const { error } = postValidation.create(data);
    if (error) {
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    const update = await Post.findByIdAndUpdate(data._id || data.id, data);
    removeFile(update.postImages);
    return { status: httpStatus.OK, message: "Post Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    const remove = await Post.findByIdAndDelete(data._id || data.id);
    // removeFile(remove.postImages)
    return { status: httpStatus.OK, message: "Post Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const festivalPost = async () => {
  try {
    const festival = await Festival.find();
    // const newFestival = await Promise.all(festival.map(async (f) => {
    //   return { ...f._doc, title: f._doc.festivalName, start: f._doc.festivalDate, end: f._doc.festivalDate }
    // }))
    const festivalPost = await FestivalPost.find();
    const newFestivalPost = await Promise.all(
      festivalPost.map(async (f) => {
        return {
          ...f._doc,
          title: f._doc.postName,
          start: f._doc.postStartDate,
          end: f._doc.postEndDate,
        };
      })
    );
    return {
      status: httpStatus.OK,
      data: { post: newFestivalPost, festivals: festival },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const createFestivalPost = async (data) => {
  try {
    await FestivalPost.create(data);
    return {
      status: httpStatus.OK,
      message: "Festival Post Added Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const updateFestivalPost = async (data) => {
  try {
    await FestivalPost.findByIdAndUpdate(data._id || data.id, data);
    return {
      status: httpStatus.OK,
      message: "Festival Post Updated Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const removeFestivalPost = async (data) => {
  try {
    const deleted = await FestivalPost.deleteOne({ _id: data });

    const getFestival = await Festival.findById(deleted.festivalId);

    if (getFestival && getFestival.isFixedDate) {
      const checkIfExist = await FestivalPost.findOne({
        festivalId: getFestival._id || getFestival.id,
        postStartDate: moment(getFestival.festivalDate).startOf("day"),
        postEndDate: moment(getFestival.festivalDate).endOf("day"),
      });
      if (!checkIfExist) {
        await FestivalPost.create({
          ...getFestival,
          postName: getFestival.festivalName,
          festivalId: getFestival._id || getFestival.id,
          postStartDate: moment(getFestival.festivalDate).startOf("day"),
          postEndDate: moment(getFestival.festivalDate).endOf("day"),
          postImages: getFestival.festivalImages,
        });
      }
    }
    return {
      status: httpStatus.OK,
      message: "Festival Post Deleted Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
  festivalPost,
  createFestivalPost,
  updateFestivalPost,
  removeFestivalPost,
};
