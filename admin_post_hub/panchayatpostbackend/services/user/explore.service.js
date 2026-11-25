const httpStatus = require("http-status");
const moment = require("moment");
const {
  Category,
  FestivalPost,
  Festival,
  Image,
  User,
  Slider,
  Subcategory,
  Greeting,
} = require("../../models");
const { shuffle } = require("../../utils/functions");

const all = async (userId) => {
  try {
    const user = userId ? await User.findById(userId) : null;
    const isElection = Boolean(user && user.userType === "election");

    const categories = await Category.aggregate([
      {
        $match: { status: true, isElection: false },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    const electionCategories = isElection
      ? await Category.aggregate([
          {
            $match: { status: true, isElection: true },
          },
          {
            $sort: { createdAt: -1 },
          },
        ])
      : [];
    const currentStart = moment().startOf("day").toDate();
    const currentEnd = moment().add(1, "month").startOf("day").toDate();

    let upComing = await FestivalPost.find({
      postStartDate: {
        $gte: currentStart,
        $lte: currentEnd,
      },
      status: true,
    }).sort({ postStartDate: 1 });

    if (!upComing || upComing.length === 0) {
      upComing = await FestivalPost.find({
        status: true,
      }).sort({ postStartDate: -1, createdAt: -1 }).limit(30);
    }

    const upComingFestivals = await Promise.all(
      upComing.map(async (d) => {
        if (d.festivalId) {
          const fest = await Festival.findById(d.festivalId);
          const images = await Image.find({ festivalId: d.festivalId });
          let festivalImages = [];
          await Promise.all(
            images.map((i) => {
              festivalImages.push(i.path);
              return;
            })
          );

          if (fest) {
            const festObj = fest.toObject ? fest.toObject() : { ...fest._doc };
            delete festObj._id;
            delete festObj.id;
            return {
              ...d._doc,
              isAvailable: moment(d.postStartDate).isBefore(
                moment().endOf("day")
              ),
              festival: { ...festObj, festivalImages: festivalImages },
            };
          }
        }
        return d;
      })
    );
    // console.log("upcoming", upComingFestivals);
    const sliders = await Slider.find();

    const categoryArr = [
      ...categories,
      ...(isElection ? electionCategories : []),
    ];
    // console.log('categoryArr', categoryArr);

    let subCategories = [];
    // await Promise.all(
    //   categoryArr.map(async (cate) => {
    //     // console.log("cate", cate);

    //     const subs = cate.subcategories;
    //     return await Promise.all(
    //       await subs.map(async (sub) => {
    //         // console.log("sub", sub);
    //         if (sub?.type === "special") {
    //           return false;
    //         }
    //         const subimages = await Image.find({
    //           subcategoryId: sub.id || sub._id,
    //         }).sort({ createdAt: -1 });
    //         const isTrending = sub.subcategoryName === "Trending";
    //         if (subimages.length > 0) {
    //           subCategories.push({
    //             ...sub,
    //             // images: shuffle(subimages).slice(0, 10),
    //             // images: subimages.slice(0, 10),
    //             images: isTrending
    //               ? subimages
    //               : shuffle(subimages).slice(0, 10),
    //           });
    //         }
    //         return true;
    //       })
    //     );
    //   })
    // );
    const mysubCategories = await Subcategory.aggregate([
      {
        $match: {
          status: true,
          categoryId: { $in: categoryArr.map((d) => d._id) },
        },
      },
      {
        $lookup: {
          from: "images",
          // localField:"subcategoryId"
          let: { subId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$subcategoryId", "$$subId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
          ],
          as: "images",
        },
      },
      { $sort: { priority: 1 } },
      { $match: { $expr: { $gt: [{ $size: "$images" }, 0] } } },
    ]);

    // console.log(
    //   "subCategories",
    //   subCategories.map((d) => ({
    //     name: d.subcategoryName,
    //     images: d.images,
    //     priority: d.priority,
    //   }))
    // );
    if (user?.personalSubcategories?.length > 0) {
      await Promise.all(
        user?.personalSubcategories.map(async (cate) => {
          const sub = await Subcategory.findById(cate);
          if (!sub) {
            return true;
          }

          const subimages = await Image.find({
            subcategoryId: sub.id || sub._id,
          });
          const isTrending = sub.subcategoryName === "Trending";
          subCategories.push({
            ...sub._doc,
            // images: shuffle(subimages).slice(0, 10),

            images: isTrending
              ? subimages.slice(0, 10)
              : shuffle(subimages).slice(0, 10),
          });
          return true;
        })
      );
    }

    const greetings = await Greeting.aggregate([
      {
        $match: { status: true, isHomePage: true },
      },
      {
        $lookup: {
          // from: "subcategories",
          // localField: "_id",
          // foreignField: "categoryId",
          // as: "subcategories",

          from: "images",
          as: "images",
          let: { greetingId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$$greetingId", "$greetingId"] }],
                },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 6,
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // console.log("subCategories", subCategories);
    return {
      status: httpStatus.OK,
      data: {
        upComingFestivals: upComingFestivals || [],
        categories: categoryArr,
        subCategories: [...mysubCategories, ...subCategories],
        sliders: sliders,
        greetings,
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

// const httpStatus = require("http-status");
// const moment = require("moment");
// const {
//   Category,
//   FestivalPost,
//   Festival,
//   Image,
//   User,
//   Slider,
//   Subcategory,
//   Greeting,
//   Customcategory,
// } = require("../../models");
// const { shuffle } = require("../../utils/functions");

// const all = async (userId) => {
//   try {
//     // const user = await User.findById(userId)

//     // const categories = await Category.aggregate([
//     //   {
//     //     $match: { status: true, isElection: false },
//     //   },
//     //   {
//     //     $lookup: {
//     //       // from: "subcategories",
//     //       // localField: "_id",
//     //       // foreignField: "categoryId",
//     //       // as: "subcategories",

//     //       from: "subcategories",
//     //       as: "subcategories",
//     //       let: { status: '$status', categoryId: '$_id' },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ['$$categoryId', '$categoryId'] },
//     //                 { $eq: ['$status', true] },
//     //               ]
//     //             }
//     //           }
//     //         },
//     //         {
//     //           $sort: { priority: 1 }
//     //         }
//     //       ]
//     //     },
//     //   },
//     //   {
//     //     $sort: { createdAt: -1 },
//     //   },
//     // ]);
//     // const electionCategories = await Category.aggregate([
//     //   {
//     //     $match: { status: true, isElection: user.userType === 'election' },
//     //   },
//     //   {
//     //     $lookup: {
//     //       // from: "subcategories",
//     //       // localField: "_id",
//     //       // foreignField: "categoryId",
//     //       // as: "subcategories",

//     //       from: "subcategories",
//     //       as: "subcategories",
//     //       let: { status: '$status', categoryId: '$_id' },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ['$$categoryId', '$categoryId'] },
//     //                 { $eq: ['$status', true] },
//     //               ]
//     //             }
//     //           }
//     //         },
//     //         {
//     //           $sort: { priority: 1 }
//     //         }
//     //       ]
//     //     },
//     //   },
//     //   {
//     //     $sort: { createdAt: -1 },
//     //   },
//     // ]);
//     // const currentStart = moment().startOf("day").toDate();
//     // const currentEnd = moment().add(1, "month").startOf("day").toDate();

//     // const upComing = await FestivalPost.find({
//     //   postStartDate: {
//     //     $gte: currentStart,
//     //     $lte: currentEnd,
//     //   },
//     //   status: true
//     // }).sort({ postStartDate: 1 }).limit(10);
//     // const upComingFestivals = await Promise.all(
//     //   upComing.map(async (d) => {
//     //     if (d.festivalId) {
//     //       const fest = await Festival.findById(d.festivalId);
//     //       const images = await Image.find({ festivalId: d.festivalId })
//     //       let festivalImages = []
//     //       await Promise.all(images.map(i => {
//     //         festivalImages.push(i.path)
//     //         return
//     //       }))

//     //       delete fest._id;
//     //       delete fest.id;
//     //       if (fest) {
//     //         return {
//     //           ...d._doc,
//     //           festival: { ...fest._doc, festivalImages: festivalImages },
//     //         };
//     //       }
//     //     }
//     //     return d;
//     //   })
//     // );
//     // const sliders = await Slider.find()

//     // const categoryArr = [...categories, ...(user.userType === 'election' ? electionCategories : [])]
//     // // console.log('categoryArr', categoryArr);

//     // let subCategories = []
//     // await Promise.all(categoryArr.map(async cate => {
//     //   const subs = cate.subcategories.sort((a, b) => a.priority - b.priority)
//     //   return await Promise.all(await subs.map(async sub => {
//     //     const subimages = await Image.find({ subcategoryId: sub.id || sub._id }).sort({ createdAt: -1 })
//     //     subCategories.push({ ...sub, images: shuffle(subimages).slice(0, 10) })
//     //     return true
//     //   }))
//     // }))

//     // const customCategory = await Customcategory.aggregate([
//     //   {
//     //     $match: { status: true, },
//     //   },
//     //   {
//     //     $lookup: {
//     //       // from: "subcategories",
//     //       // localField: "_id",
//     //       // foreignField: "categoryId",
//     //       // as: "subcategories",

//     //       from: "images",
//     //       as: "images",
//     //       let: { customcategoryId: '$_id' },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ['$$customcategoryId', '$customcategoryId'] },
//     //               ]
//     //             }
//     //           }
//     //         },
//     //         {
//     //           $sort: { createdAt: -1 }
//     //         }
//     //       ]
//     //     },
//     //   },
//     //   {
//     //     $sort: { createdAt: -1 },
//     //   },
//     // ]);

// const greetings = await Greeting.aggregate([
//   {
//     $match: { status: true, isHomePage: true },
//   },
//   {
//     $lookup: {
//       // from: "subcategories",
//       // localField: "_id",
//       // foreignField: "categoryId",
//       // as: "subcategories",

//       from: "images",
//       as: "images",
//       let: { greetingId: '$_id' },
//       pipeline: [
//         {
//           $match: {
//             $expr: {
//               $and: [
//                 { $eq: ['$$greetingId', '$greetingId'] },
//               ]
//             }
//           }
//         },
//         {
//           $sort: { createdAt: -1 }
//         }
//       ]
//     },
//   },
//   {
//     $sort: { createdAt: -1 },
//   },
// ]);

//     // return {
//     //   status: httpStatus.OK,
//     //   data: [
//     //     {
//     //       type: 'sliders',
//     //       data: sliders
//     //     }, {
//     //       type: "upcommingfest",
//     //       data: upComingFestivals || [],
//     //     },
//     //     {
//     //       type: "customcategories",
//     //       data: customCategory || [],
//     //     },
//     //     {
//     //       type: "greetings",
//     //       data: greetings || [],
//     //     }, {
//     //       type: 'subcategories',
//     //       data: subCategories,
//     //     }
//     //   ],
//     // };

//     const currentStart = moment().startOf("day").toDate();
//     const currentEnd = moment().add(1, "month").startOf("day").toDate();
//     const user = await User.findById(userId);

//     const [sliders, subcategories] = await Promise.all([
//       await Slider.find(),
//       await Subcategory.aggregate([
//         {
//           $match: { status: true },
//         },
//         {
//           $lookup: {
//             // from: "subcategories",
//             // localField: "_id",
//             // foreignField: "categoryId",
//             // as: "subcategories",

//             from: "images",
//             as: "images",
//             let: { subcategoryId: "$_id" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [{ $eq: ["$$subcategoryId", "$subcategoryId"] }],
//                   },
//                 },
//               },
//               {
//                 $sort: { createdAt: -1 },
//               },
//             ],
//           },
//         },
//         {
//           $addFields: {
//             imageArr: {
//               $function: {
//                 body: function (images) {
//                   const shuffle = (array) => {
//                     let currentIndex = array.length,
//                       randomIndex;

//                     // While there remain elements to shuffle...
//                     while (currentIndex != 0) {
//                       // Pick a remaining element...
//                       randomIndex = Math.floor(Math.random() * currentIndex);
//                       currentIndex--;

//                       // And swap it with the current element.
//                       [array[currentIndex], array[randomIndex]] = [
//                         array[randomIndex],
//                         array[currentIndex],
//                       ];
//                     }

//                     return array;
//                   };
//                   return shuffle(images).slice(0, 10);
//                 },
//                 args: ["$images"],
//                 lang: "js",
//               },
//             },
//           },
//         },
//         {
//           $sort: { priority: 1 },
//         },
//       ]),
//     ]);
//     console.log("subcategories", subcategories);
//     return {
//       status: httpStatus.OK,
//       data: [
//         {
//           type: "sliders",
//           data: sliders,
//         },
//         {
//           type: "subcategories",
//           data: subcategories,
//         },
//       ],
//     };
//   } catch (error) {
//     console.log(error);
//     return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
//   }
// };

// module.exports = {
//   all,
// };
