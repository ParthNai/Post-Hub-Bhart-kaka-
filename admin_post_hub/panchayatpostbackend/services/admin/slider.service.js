const httpStatus = require("http-status");
const { Slider, Festival, Image } = require("../../models");
const { getFilesData } = require("../../utils/functions");

const all = async () => {
  try {
    let sliders = await Slider.find().lean();
    
    // Automatically include any Festival or Announcement marked showInHero: true
    try {
      const heroFestivals = await Festival.find({ showInHero: true, status: true }).lean();
      for (const hf of heroFestivals) {
        const img = await Image.findOne({ festivalId: hf._id }).lean();
        if (img && img.path) {
          sliders.unshift({
            _id: hf._id,
            id: hf._id,
            sliderName: hf.festivalName,
            sliderLink: `/festivals`,
            sliderImage: img.path,
            isHeroAnnouncement: true,
            recommendedFrameId: hf.recommendedFrameId || img.recommendedFrameId || null,
          });
        }
      }
    } catch (e) {
      console.warn("Could not merge hero announcements into sliders:", e.message);
    }

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
