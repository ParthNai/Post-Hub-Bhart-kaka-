const httpStatus = require("http-status");
const { Image, FestivalPost, Festival } = require("../../models");
const moment = require('moment')

const all = async () => {
  try {
    const currentStart = moment().startOf("day");
    const currentEnd = moment().add(1, "month").startOf("day");

    const upComing = await FestivalPost.find({
      postStartDate: {
        $gte: currentStart.toDate(),
        $lte: currentEnd.toDate(),
      },
      status: true
    }).sort({ postStartDate: 1 }).limit(20);
    const upComingFestivals = await Promise.all(
      upComing.map(async (d) => {
        if (d.festivalId) {
          const fest = await Festival.findById(d.festivalId);
          const images = await Image.find({ festivalId: d.festivalId })
          let festivalImages = []
          await Promise.all(images.map(i => {
            festivalImages.push(i.path)
            return
          }))

          delete fest._id;
          delete fest.id;
          if (fest) {
            return {
              ...d._doc,
              festival: { ...fest._doc, festivalImages: festivalImages },
            };
          }
        }
        return d;
      })
    );
    return { status: httpStatus.OK, data: upComingFestivals };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};


module.exports = {
  all
};
