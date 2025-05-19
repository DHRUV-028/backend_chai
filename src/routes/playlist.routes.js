import Router from "express";
import {createPlaylist} from "../controllers/playlist.controller.js"
import verifyJwt from "../middlewares/auth.middleware.js";

const playlistRouter = Router();

playlistRouter.route("/createPlaylist/:videoId").post(verifyJwt ,createPlaylist)

export default playlistRouter;
