import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import userModal from "../models/userModal.js";
import ErrorHandler from "../utils/errorHandle.js";

export const registerController = catchAsyncError(async (req, res, next) => {
  //   try {
  const { userName, name, email, password } = req.body;

  // validate
  if (!userName) {
    next(new ErrorHandler("Please provide user name", 200));
  }

  if (!email) {
    next(new ErrorHandler("Please provide email", 200));
  }

  if (!password) {
    next(new ErrorHandler("Please provide password", 200));
  }

  const existingUser = await userModal.findOne({ email });
  const existingUserName = await userModal.findOne({ userName });

  if (existingUser) {
    next(new ErrorHandler("User already exists", 200));
  }
  if (existingUserName) {
    next(new ErrorHandler("User name already exists", 200));
  }

  const user = await userModal.create({
    userName,
    name,
    email,
    password,
    profileType: "admin",
  });

  // token
  let token = await user.createJwt();

  res.status(201).send({
    message: "New user created successfuly",
    success: true,
    token,
  });

  // if (user) {

  // }
  // }
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
});

export const loginController = async (req, res, next) => {
  let { email, password } = req.body;

  // validate

  if (!email) {
    // next("Please provide email");
    return next(new ErrorHandler("Please provide email", 200));
  }

  if (!password) {
    // next("Please provide password");
    return next(new ErrorHandler("Please provide password", 200));
  }

  const user = await userModal.findOne({ email });
  const isMatch = await user?.comparePassword(password);

  if (!user || !isMatch) {
    // next("Invalid Email or Password");
    return next(new ErrorHandler("Invalid Email or Password", 200));
  }

  // if (!isMatch) {
  //   next("Invalid Email or Password");
  // }

  let token = user?.createJwt();

  res.status(200).json({
    message: "Login successfuly",
    success: true,
    token,
  });
};
