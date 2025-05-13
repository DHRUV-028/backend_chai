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

const router = Router();

router.route("/register").post(
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

router.route("/login").post(login);

router.route("/logout").post(verifyJwt, logout);
router.route("/change-password").post(verifyJwt, changePassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);

// using patch otherwise it will update all information
router.route("/update-details").patch(verifyJwt, updateAccountDetails);
router
  .route("/updateAvatar")
  .patch(verifyJwt, upload.single("avatar"), updateAvatar);

router
  .route("/update-cover-image")
  .patch(verifyJwt, upload.single("cover-image"), updateCoverImage);

router.route("/channel/:userName").get(verifyJwt, getUserChannelProfile);

router.route("/histoy").get(verifyJwt, getWatchHistory);

export default router;
