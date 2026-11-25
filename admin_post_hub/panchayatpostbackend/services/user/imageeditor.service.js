const httpStatus = require("http-status");
const moment = require("moment");
const {
  Category,
  FestivalPost,
  Festival,
  Frame,
  Image,
} = require("../../models");

const all = async (query, userId, userType) => {
  const { festivalId, categoryId, subCategoryId, isElection } = query;
  try {
    let templates = [];
    let frames = [];
    if (festivalId) {
      const tem = await Festival.findById(festivalId);
      const festivalImages = await Image.find({ festivalId: festivalId })
      await Promise.all(
        festivalImages.map((f) => {
          const data = {
            path: f.path,
            ...tem._doc,
            _id: f._id || f.id,
            festivalImages: undefined,
            festivalId: tem._doc._id,
          };
          templates.push(data);
        })
      );
    } else {
      const tem = await Image.find({
        subcategoryId: subCategoryId,
      });
      await Promise.all(
        tem.map((f) => {
          // const data = {
          //   path: f,
          //   ...tem._doc,

          // };
          templates.push(f);
        })
      );


      // frames = await Promise.all(
      //   fr.map((f) => {
      //     return {
      //       ...f._doc,
      //     };
      //   })
      // );
    }

    // const fr = await Frame.find({ isElection: isElection });
    let frame = [];
    const bfr = await Image.find({ userId: userId, userType: 'business' });
    const afr = await Frame.find({ isElection: false });

    switch (userType) {
      case "business":
        frame = [...afr, ...bfr]
        break;
      case "panchayat":
        const pfr = await Image.find({ userId: userId, userType: 'panchayat' });
        frame = [...afr, ...bfr, ...pfr]
        break;
      case "election":
        const efr = await Image.find({ userId: userId, userType: 'election' });
        frame = [...afr, ...efr]
        break;
      default:
        break;
    }

    if (frame.length > 0) {
      frames = await Promise.all(
        frame.map((f) => {
          return {
            ...f._doc,
          };
        })
      );
    } else {
      const fr = await Frame.find({ isElection: isElection });
      frames = await Promise.all(
        fr.map((f) => {
          return {
            ...f._doc,
          };
        })
      );
    }
    return {
      status: httpStatus.OK,
      data: {
        templates: templates,
        frames: frames,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
};
