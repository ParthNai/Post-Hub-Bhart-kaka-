const httpStatus = require("http-status");
const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("../../config/config");
const sendSms = require("../../middlewares/sendSMS");
const getUserData = require("../../middlewares/userData");

const generateOtp = () => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const register = async (data) => {
  const mobile = Number(data.mobile);
  const existingUser = await User.findOne({ mobile });
  if (existingUser) {
    return {
      status: httpStatus.CONFLICT,
      message: "User already exist",
    };
  }

  await User.create({
    name: data.name.trim(),
    mobile,
    pin: data.pin,
    occupation: data.occupation.trim(),
    village: data.village?.trim() || null,
    taluka: data.taluka?.trim() || null,
    district: data.district?.trim() || null,
    status: true,
    userType: "panchayat",
    downloadLimit: 9,
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=ffaa40&color=ffffff`,
  });

  return {
    status: httpStatus.OK,
    message: "User registered successfully",
  };
};

const sendloginotp = async (data) => {
  try {
    const user = await User.findOne({ mobile: data.mobile, role: "user" });

    // if (user) {
    //   if (!user.status) {
    //     return {
    //       status: httpStatus.INTERNAL_SERVER_ERROR,
    //       message: "Inactive account!",
    //     };
    //   }
    // }
    if (data.mobile === "9999999999") {
      if (user) {
        await User.findByIdAndUpdate(user._id, { otp: 1234 });
      } else {
        await User.create({ mobile: data.mobile, otp: 1234 });
      }
      return { status: httpStatus.OK, message: `OTP is 1234` };
    }

    const otp = generateOtp();
    // const message = `OTP is ${otp} Use it to verify your mobile number on EgramPost app. Please do not share your OTP with anyone to avoid fraudulent activities. ${data.signature} EGPOST`
    const message = `${otp} is OTP. Use it to verify your mobile number on EgramPost app. Please do not share your OTP with anyone to avoid fraudulent activities. ${data.signature} EGPOST`;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(otp, salt);
    if (data.mobile) {
      const sendotp = await sendSms(data.mobile, message);
      if (!sendotp) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to send OTP",
        };
      }
    }
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        otp: otp,
        password: hashPassword,
      });
    } else {
      await User.create({
        mobile: data.mobile,
        otp: otp,
        password: hashPassword,
      });
    }
    return { status: httpStatus.OK, message: `OTP sent successfully` };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const checkIfUserExist = async (data) => {
  try {
    const rawMobile = data.mobile;
    const numMobile = Number(rawMobile);
    const query = {
      $or: [
        { mobile: rawMobile },
        ...(isNaN(numMobile) ? [] : [{ mobile: numMobile }]),
        { userName: String(rawMobile) }
      ]
    };
    const user = await User.findOne(query);

    if (!user) {
      return {
        status: httpStatus.OK,
        isExist: false,
        message: "User Not found",
      };
    }
    return { status: httpStatus.OK, isExist: true, message: "User Found" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};
const login = async (data) => {
  try {
    const pinVal = data.otp || data.pin || data.password;
    const rawMobile = data.mobile || data.username;
    const numMobile = Number(rawMobile);

    const mobileConditions = [
      { mobile: rawMobile },
      ...(isNaN(numMobile) ? [] : [{ mobile: numMobile }]),
      { userName: String(rawMobile) },
      { email: String(rawMobile) }
    ];

    const user = await User.findOne({ $or: mobileConditions });

    if (!user) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Invalid Pin or user does not exist",
      };
    }
    if (!user.status) {
      return {
        status: httpStatus.FORBIDDEN,
        message: "Account is inactive, please contact your administrator.",
      };
    }

    // Verify pin or password
    let isValid = false;
    if (user.pin && (String(user.pin) === String(pinVal))) {
      isValid = true;
    } else if (user.password) {
      if (user.password === pinVal) {
        isValid = true;
      } else {
        try {
          isValid = await bcrypt.compare(String(pinVal), user.password);
        } catch (_) {}
      }
    }

    if (!isValid) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Invalid Pin or user does not exist",
      };
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userData = await getUserData(user);
    return {
      status: httpStatus.OK,
      user: userData,
      token: token,
      message: "Login Success",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const socialLogin = async (data) => {
  try {
    const user = await User.findOne({ email: data.email });
    if (user) {
      const checkuser = await User.findById(user._id);
      if (
        checkuser.userSocial &&
        checkuser.userSocial.find((item) => {
          return item.socialId == data.socialId;
        })
      ) {
      } else {
        await User.findByIdAndUpdate(user._id, {
          $push: {
            userSocial: {
              socialId: data.socialId,
              socialType: data.socialType,
            },
          },
        });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return { status: httpStatus.OK, user: user };
    }
    await User.create(data);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return {
      status: httpStatus.OK,
      user: user,
      message: "User registered successfully",
      token: token,
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register user",
    };
  }
};

const details = async (userId) => {
  const user = await User.findOne({ _id: userId });

  // if (!user) {
  //   return {
  //     status: httpStatus.NOT_FOUND,
  //     message: "User not found",
  //   };
  // }
  if (!user) {
    return { status: httpStatus.NOT_FOUND, message: "user does not exist" };
  }
  const userData = await getUserData(user);

  return {
    status: httpStatus.OK,
    user: userData,
    message: "User details found successfully",
  };
};

const forgotPassword = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return { status: httpStatus.NOT_FOUND, message: "user does not exist" };
  }
  const otp = generateOtp();
  const storeotp = await User.findByIdAndUpdate(user._id, { otp: otp });
  if (storeotp) {
    const transport = nodemailer.createTransport(config.email.smtp);
    const verifyEmail = await transport.verify();
    if (!verifyEmail) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message:
          "Failed to send forgot password request, please send your queries on the email address given above.",
      };
    }
    let mailDetails = {
      from: config.email.from,
      to: user.email,
      subject: "OTP for forgot password",
      html: `<!DOCTYPE html>
            <html>
            
            <head>
                <title>OTP for forgot password</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
            
                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
            
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
            
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
            
                    table {
                        border-collapse: collapse !important;
                    }
            
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
            
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div
                    style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                    We're thrilled to have you here! Get ready to dive into your new account. </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#5d3ea8" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#5d3ea8" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top"
                                        style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <img src="https://eduparv.com/website/images/logo.png" width="125" height="120"
                                            style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 20px 30px 40px 30px; color: #454545; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 25px;">
                                        <p style="margin: 0;text-align: center;">Please use the verification code below on the
                                            Eduparv app : </p>
                                        <h1 style="font-size: 40px; font-weight: 600; margin: 2;text-align: center;">${otp}</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">If you didn't request this, you can ingnore this email or let us know.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">Thanks,<br>Eduparv Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            
            </html>`,
    };

    try {
      const mailsend = await transport.sendMail(mailDetails);
      if (mailsend) {
        return {
          status: httpStatus.OK,
          message: "OTP send to your registered email address",
        };
      }
    } catch (error) {
      return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
    }
  }
};

const checkOtp = async (data) => {
  const user = await User.findOne({ email: data.email, otp: data.otp });
  if (user) {
    await User.findByIdAndUpdate(user._id, { otp: null });
    return { status: httpStatus.OK, data: user._id, message: "OTP matched" };
  }
  return { status: httpStatus.INTERNAL_SERVER_ERROR, message: "Invalid OTP" };
};

const changeForgotPassword = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(data.newPassword, salt);
  if (
    await User.findByIdAndUpdate(
      data.userId,
      { password: hashPassword },
      {
        new: false,
      }
    )
  ) {
    return { status: httpStatus.OK, message: "Password Changed Successfully" };
  }
  return {
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: "Failed to change password",
  };
};

module.exports = {
  register,
  login,
  details,
  socialLogin,
  forgotPassword,
  checkOtp,
  changeForgotPassword,
  sendloginotp,
  checkIfUserExist,
};
