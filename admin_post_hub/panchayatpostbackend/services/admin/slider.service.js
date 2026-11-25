const httpStatus = require("http-status");
const { Slider } = require("../../models");
const { getFilesData } = require("../../utils/functions");

const all = async () => {
  try {
    const sliders = await Slider.find();
    return {
      status: httpStatus.OK,
      data: sliders,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const create = async (data, files) => {
  try {
    data.sliderImage = await getFilesData(files[0])
    await Slider.create(data);
    return { status: httpStatus.OK, message: "Slider Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    data.sliderImage = await getFilesData(files[0])
    await Slider.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    return { status: httpStatus.OK, message: "Slider Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await Slider.findByIdAndDelete(data._id || data.id);
    return { status: httpStatus.OK, message: "Slider Deleted Successfully" };
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
