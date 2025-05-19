import Router from "express";
import {
  registerUser,
  login,
  logout,
  updateAccountDetails,
  updateAvatar,
  getCurrentUser,
  updateCoverImage,
  changePassword,
  getUserChannelProfile,
  refreshAccessToken,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(login);

userRouter.route("/logout").post(verifyJwt, logout);
userRouter.route("/change-password").post(verifyJwt, changePassword);
userRouter.route("/current-user").get(verifyJwt, getCurrentUser);

// using patch otherwise it will update all information
userRouter.route("/update-details").patch(verifyJwt, updateAccountDetails);
userRouter
  .route("/updateAvatar")
  .patch(verifyJwt, upload.single("avatar"), updateAvatar);

userRouter
  .route("/update-cover-image")
  .patch(verifyJwt, upload.single("cover-image"), updateCoverImage);

userRouter.route("/channel/:userName").get(verifyJwt, getUserChannelProfile);

userRouter.route("/histoy").get(verifyJwt, getWatchHistory);

export default userRouter;
