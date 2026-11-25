const httpStatus = require("http-status");
const { Greeting, Image } = require("../../models");

const all = async (id) => {
  try {
    if (id) {
      const greeting = await Greeting.findById(id);
      const imgs = await Image.find({ greetingId: id });
      return {
        status: httpStatus.OK,
        data: { ...greeting._doc, images: imgs },
      };
    } else {
      const greetings = await Greeting.find({ status: true }).sort({
        createdAt: 1,
      });
      const images = await Promise.all(
        greetings.map(async (s) => {
          const imgs = await Image.find({ greetingId: s.id || s._id });
          return { ...s._doc, images: imgs };
        })
      );
      return {
        status: httpStatus.OK,
        data: images,
      };
    }
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
};
