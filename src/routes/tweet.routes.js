import Router from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const tweetRouter = Router();

tweetRouter.route("/createTweet").post(verifyJwt, createTweet);
tweetRouter.route("/getTweet").get(verifyJwt, getUserTweets);
tweetRouter.route("/updateTweet/:tweetId").patch(verifyJwt, updateTweet);

tweetRouter.route("/deleteTweet/:tweetId").delete(deleteTweet);


export default tweetRouter