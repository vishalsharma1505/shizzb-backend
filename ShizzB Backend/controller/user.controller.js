const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { sendEmail } = require("../config/email");
const { generateToken, tokenForVerify } = require("../utils/token");
const { secret } = require("../config/secret");

// register user
// sign up
exports.signup = async (req, res,next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      const userData = {
  ...req.body,
  role: req.body.role || "user",
  status: "active",
};

const saved_user = await User.create(userData);
      const token = saved_user.generateConfirmationToken();

      await saved_user.save({ validateBeforeSave: false });

      res.status(200).json({
  status: "success",
  message: "User registered successfully",
});



      // const mailData = {
      //   from: secret.email_user,
      //   to: `${req.body.email}`,
      //   subject: "Email Activation",
      //   subject: "Verify Your Email",
      //   html: `<h2>Hello ${req.body.name}</h2>
      //   <p>Verify your email address to complete the signup and login into your <strong>shofy</strong> account.</p>
  
      //     <p>This link will expire in <strong> 10 minute</strong>.</p>
  
      //     <p style="margin-bottom:20px;">Click this link for active your account</p>
  
      //     <a href="${secret.client_url}/email-verify/${token}" style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Account</a>
  
      //     <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>
  
      //     <p style="margin-bottom:0px;">Thank you</p>
      //     <strong>shofy Team</strong>
      //      `,
      // };
      // const message = "Please check your email to verify!";
      // sendEmail(mailData, res, message);
    }
  } catch (error) {
  console.log("🔥 SIGNUP ERROR:", error);

  return res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
};

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
// ============================
// ADMIN - GET ALL CUSTOMERS
// ============================

exports.getAllCustomers = async (req, res, next) => {
  try {

    const customers = await User.find(
      { role: "user" },
      "-password"
    ).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: customers,
    });

  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await User.findOne({ email });

    console.log("User Found:", user?.email);
console.log("Compare Function:", typeof user.comparePassword);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    if (user.status != "active") {
  return res.status(401).json({
    status: "fail",
    error: "Your account is not active yet.",
  });
}

// ===========================
// Update Last Login
// ===========================
user.lastLogin = new Date();
await user.save({ validateBeforeSave: false });

const token = generateToken(user);

const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    next(error)
  }
};

// confirmEmail
exports.confirmEmail = async (req, res,next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    const accessToken = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
      data: {
        user: others,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error)
  }
};

// forgetPassword
exports.forgetPassword = async (req, res,next) => {
  try {
    const { verifyEmail } = req.body;
    const user = await User.findOne({ email: verifyEmail });
    if (!user) {
      return res.status(404).send({
        message: "User Not found with this email!",
      });
    } else {
      const token = tokenForVerify(user);
      const body = {
        from: secret.email_user,
        to: `${verifyEmail}`,
        subject: "Password Reset",
        html: `<h2>Hello ${verifyEmail}</h2>
        <p>A request has been received to change the password for your <strong>Shofy</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${secret.client_url}/forget-password/${token} style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Shofy Team</strong>
        `,
      };
      user.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      user.confirmationTokenExpires = date;
      await user.save({ validateBeforeSave: false });
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    next(error)
  }
};

// confirm-forget-password
exports.confirmForgetPassword = async (req, res,next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      await User.updateOne(
        { confirmationToken: token },
        { $set: { password: newPassword } }
      );

      user.confirmationToken = undefined;
      user.confirmationTokenExpires = undefined;

      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
exports.changePassword = async (req, res,next) => {
  try {
    const {email,password,googleSignIn,newPassword} = req.body || {};
    const user = await User.findOne({ email: email });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(googleSignIn){
      const hashedPassword = bcrypt.hashSync(newPassword);
      await User.updateOne({email:email},{password:hashedPassword})
      return res.status(200).json({ message: "Password changed successfully" });
    }
    if(!bcrypt.compareSync(password, user?.password)){
      return res.status(401).json({ message: "Incorrect current password" });
    }
    else {
      const hashedPassword = bcrypt.hashSync(newPassword);
      await User.updateOne({email:email},{password:hashedPassword})
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    next(error)
  }
};

// update a profile
exports.updateUser = async (req, res,next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.address = req.body.address;
      user.bio = req.body.bio; 
      const updatedUser = await user.save();
      const token = generateToken(updatedUser);
      res.status(200).json({
        status: "success",
        message: "Successfully updated profile",
        data: {
          user: updatedUser,
          token,
        },
      });
    }
  } catch (error) {
    next(error)
  }
};

// signUpWithProvider
exports.signUpWithProvider = async (req, res,next) => {
  try {
    const user = jwt.decode(req.params.token);
    const isAdded = await User.findOne({ email: user.email });
    if (isAdded) {
      const token = generateToken(isAdded);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: isAdded._id,
            name: isAdded.name,
            email: isAdded.email,
            address: isAdded.address,
            phone: isAdded.phone,
            imageURL: isAdded.imageURL,
            googleSignIn:true,
          },
        },
      });
    } else {
      const newUser = new User({
        name: user.name,
        email: user.email,
        imageURL: user.picture,
        status: 'active'
      });

      const signUpUser = await newUser.save();
      // console.log(signUpUser)
      const token = generateToken(signUpUser);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: signUpUser._id,
            name: signUpUser.name,
            email: signUpUser.email,
            imageURL: signUpUser.imageURL,
            googleSignIn:true,
          }
        },
      });
    }
} catch (error) {
  console.log("GOOGLE LOGIN ERROR =>", error);
  res.status(500).json({
    success: false,
    error: error.message,
  });
}
};
// ============================
// ADMIN - DELETE CUSTOMER
// ============================

exports.deleteCustomer = async (req, res, next) => {
  try {

    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

exports.changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = bcrypt.compareSync(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = newPassword;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (err) {
    next(err);
  }
};