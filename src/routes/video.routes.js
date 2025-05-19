import Router from "express";
import {
  deleteVideo,
  getVideoById,
  publishAVideo,
  updateVideo,
  togglePublishStatus
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const videoRouter = Router();

videoRouter.route("/upload").post(
  verifyJwt,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

videoRouter.route("/findVideo/:videoId").get(verifyJwt, getVideoById);

videoRouter
  .route("/update/:videoId")
  .patch(verifyJwt, upload.single("thumbnail"), updateVideo);
  
videoRouter.route("/delete/:videoId").get(verifyJwt, deleteVideo);

videoRouter.route("/toggle/:videoId").get(verifyJwt, togglePublishStatus);
export default videoRouter;
