import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import Router from "express";
import verifyJwt from "../middlewares/auth.middleware.js";

const commentRouter = Router();
// console.log("cerfe");

commentRouter.route("/add-comment/:videoId").post(verifyJwt, addComment);
commentRouter.route("/update-comment/:commentId").patch(verifyJwt, updateComment);
commentRouter.route("/delete-comment/:commentId").delete(verifyJwt, deleteComment);
commentRouter.route("/getVideo-comment/:videoId").get(verifyJwt, getVideoComments);



export default commentRouter;