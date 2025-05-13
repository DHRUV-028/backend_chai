import { User } from "../models/user.models.js";
import  jwt  from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const loggedout = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorizration").replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(400, "Token not found");
    }
  
    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Your access token is invalid");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401 , "unauthorized access");
  }
});


export default loggedout;