const httpStatus = require("http-status");
const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateOtp = () => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const login = async (data) => {
  let user = await User.findOne({
    email: data.email,
    role: { $ne: "user" },
    status: true,
  });
  if (!user) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "User does not exist",
    };
  }
  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword)
    return { status: httpStatus.NOT_FOUND, message: "Invalid password" };
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // const newuser = await getUserBranchCode(user);

  return {
    status: httpStatus.OK,
    user: user,
    token: token,
    message: "Login Successs",
  };
};

const details = async (data) => {
  let user = await User.findOne({ _id: data });
  if (!user) {
    return { status: httpStatus.NOT_FOUND, message: "user does not exist" };
  }
  // const newuser = await getUserBranchCode(user);
  return {
    status: httpStatus.OK,
    user: user,
    // message: "User details found successfully",
  };
};

const forgotpassword = async (data) => {
  try {
    const user = await User.findOne({ mobile: data.mobile });
    if (!user) {
      return { status: httpStatus.NOT_FOUND, message: "user does not exist" };
    }
    const otp = generateOtp();
    // const smsStatus = await smsSend(data.mobile, otp);
    // if (smsStatus.status == 200) {
    //   await User.findByIdAndUpdate(user._id, { otp: otp });
    //   return { status: httpStatus.OK, message: `OTP sent successfully` };
    // } else {
    //   return {
    //     status: httpStatus.INTERNAL_SERVER_ERROR,
    //     message: `Fail to send OTP`,
    //   };
    // }
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Fail to send OTP",
    };
  }
};

const changeForgotPassword = async (data) => {
  try {
    const user = await User.findOne({ email: data.email, otp: data.otp });
    if (!user) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Invalid OTP",
      };
    }
    await User.findByIdAndUpdate(user._id, { otp: null });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.newPassword, salt);
    await User.findByIdAndUpdate(user._id, { password: hashPassword });
    return { status: httpStatus.OK, message: "Password Changed Successfully" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to change password",
    };
  }
};
const deleteaccount = async (data) => {
  try {
    const users = await User.findOne({ mobile: data.mobile, pin: data.pin });
    console.log("delete account req", data);
    if (!users) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Invalid Pin or user does not exist",
      };
    } else {
      const deleted = await User.findByIdAndDelete(users._id);

      return {
        status: httpStatus.OK,
        message: "Your account has been deleted",
      };
    }
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  login,
  details,
  forgotpassword,
  changeForgotPassword,
  deleteaccount,
};
