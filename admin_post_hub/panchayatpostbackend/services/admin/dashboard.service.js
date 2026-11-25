const { User, Festival, Greeting } = require("../../models");
const razorpay = require("../../razorpay");
const httpStatus = require("http-status");

const all = async () => {
  const totalUsers = await User.count();
  const users = await User.count({ role: "user" });
  const festivals = await Festival.count();
  const totalGreetings = await Greeting.count();

  //random user generation

  //   const randomUser = randomIntFromInterval(1, 10);

  //   const newUsers = new Array(100).fill("_").map((r, rI) => {
  //     return {
  //       name: `dummy - ${randomIntFromInterval(1, 100)} - ${rI}`,
  //       mobile: new Array(10)
  //         .fill("_")
  //         .map((e) => randomIntFromInterval(6, 9))
  //         .join(""),
  //       role: "user",

  //       email: `dummy${randomIntFromInterval(1, 100)}${randomIntFromInterval(
  //         1,
  //         100
  //       )}${rI}@mail.com`,

  //       pin: Number(
  //         new Array(4)
  //           .fill("_")
  //           .map((e) => randomIntFromInterval(1, 9))
  //           .join("")
  //       ),
  //       village: `dummyvillage${randomIntFromInterval(
  //         1,
  //         100
  //       )}${randomIntFromInterval(1, 100)}${rI}`,
  //       taluka: `dummytaluka${randomIntFromInterval(
  //         1,
  //         100
  //       )}${randomIntFromInterval(1, 100)}${rI}`,
  //       district: `dummydistrict${randomIntFromInterval(
  //         1,
  //         100
  //       )}${randomIntFromInterval(1, 100)}${rI}`,

  //       status: true,

  //       userType: "panchayat",

  //       downloadLimit: 9,
  //       todayDownloadCount: 0,
  //     };
  //   });

  //   const added = await User.insertMany(newUsers);

  // const userSubscription = await razorpay.payments.all()
  //   let revenue = 0;
  // let subscriptionCount = 0
  // const transactions = await Promise.all(userSubscription.items.map(tran => {
  //     revenue = tran.status !== 'failed' ? revenue + (tran.amount / 100) : revenue
  //     subscriptionCount = tran.status !== 'failed' ? subscriptionCount + 1 : subscriptionCount
  //     return { ...tran, orderId: tran.order_id, mobile: tran.contact, email: tran.email, paymentId: tran.vpa, paymentStatus: tran.status, amount: tran.amount / 100 }
  // }))
  const data = {
    totalGreetings,
    totalUsers,
    activeUserCount: users,
    festivalCount: festivals,
    //  revenue: revenue, subscriptionCount: subscriptionCount,
    // userSubscription: transactions
  };
  return {
    status: httpStatus.OK,
    data: data,
  };
};

module.exports = {
  all,
};
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
