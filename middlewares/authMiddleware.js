import Jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandle.js";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader) {
    // || !authHeader.startsWith("Bearer")
    // next("Auth Failed 1");
    next(new ErrorHandler("Auth Failed1", 401));
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = Jwt.verify(token, process.env.secretkey);
    // console.log(payload.userId);
    req.userId = payload.userId;
    next();
  } catch (error) {
    next(new ErrorHandler("Auth Failed2", 401));
    console.log(error);
  }
};

export default userAuth;
