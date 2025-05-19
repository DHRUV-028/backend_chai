import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { updateComment } from "./comment.controller.js"

const createTweet = asyncHandler(async (req, res) => {
    const {tweetContent} = req.body;
    if(!tweetContent){
        throw new ApiError(400 , "Provide Tweet")
    }
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(400,"Error in getting User Id");
    }

    const tweet = await Tweet.create({
        content :tweetContent,
        owner :userId
    })

    if(!tweet){
        throw new ApiError(400 , "Error in tweet")
    }

    const createdTweet = await Tweet.findById(tweet._id).select("-owner -_id")

    if(!createdTweet){
        throw new ApiError(400 , "Error in created tweet")
    }

    return res.status(201)
    .json(new ApiResponse(201 , createdTweet , "Tweet created successfully"))
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(400,"Error in getting User Id");
    }

    const userTweet = await Tweet.find({owner :userId})

    if(!userTweet){
        throw new ApiError(400,"Error in finding User tweet");
    }

    return res.status(200)
    .json(new ApiResponse(200 , userTweet , "Tweet fetched successfully"))

    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {updatedContent} = req.body

    if(!(tweetId || updatedContent)){
        throw new ApiError(400 , "Error in either tweetId or updated Comment")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId , {
        $set:{
            content :updatedContent
        }
    },{
        new :true
    })

    if(!updatedTweet){
        throw new ApiError(400 , "Error in updated Tweet");
    }

    return res.status(200)
    .json(new ApiResponse(200 , updatedTweet , "Tweet updated successfully"));
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId ){
        throw new ApiError(400 , "Error in either tweetId ")
    }

 const deleted = await Tweet.deleteOne({_id :tweetId})

 if(!deleted){
    throw new ApiError(400 , "Error while deleting tweet")
 }

 return res.status(200)
 .json(new ApiResponse(200 , deleted , "Tweet deleted successfully"))
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

