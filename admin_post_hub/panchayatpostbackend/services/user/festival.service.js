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
            const todayStart = moment().startOf("day");
            const startMoment = d.postStartDate ? moment(d.postStartDate).startOf("day") : (fest.festivalDate ? moment(fest.festivalDate).startOf("day") : null);
            const isLocked = Boolean(startMoment && startMoment.isAfter(todayStart));
            return {
              ...d._doc,
              isAvailable: !isLocked,
              isLocked: isLocked,
              festival: { ...fest._doc, festivalImages: festivalImages },
            };
          }
        }
        return d;
      })
    );
    return {
      status: httpStatus.OK,
      serverTime: new Date().toISOString(),
      serverDate: moment().format("YYYY-MM-DD"),
      data: upComingFestivals,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const checkAccess = async (festivalId) => {
  try {
    const fest = await Festival.findById(festivalId);
    if (!fest) {
      return { status: httpStatus.NOT_FOUND, locked: false, message: "Festival not found" };
    }
    const todayStart = moment().startOf("day");
    const festStart = fest.festivalDate ? moment(fest.festivalDate).startOf("day") : null;
    const isLocked = Boolean(festStart && festStart.isAfter(todayStart));
    const releaseDate = festStart ? festStart.format("YYYY-MM-DD") : null;
    const serverDate = todayStart.format("YYYY-MM-DD");
    if (isLocked) {
      return {
        status: httpStatus.FORBIDDEN,
        locked: true,
        isAvailable: false,
        releaseDate,
        serverDate,
        serverTime: new Date().toISOString(),
        message: `This festival opens on ${releaseDate}. You cannot open it before that date.`,
      };
    }
    return {
      status: httpStatus.OK,
      locked: false,
      isAvailable: true,
      releaseDate,
      serverDate,
      serverTime: new Date().toISOString(),
      data: fest,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message || "Error checking festival access" };
  }
};

module.exports = {
  all,
  checkAccess,
};
