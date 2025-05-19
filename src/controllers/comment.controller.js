import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
//   const { page = 1, limit = 10 } = req.query;
  const allCommentOnAVideo = await Comment.find({video:videoId})
  if(!allCommentOnAVideo){
    throw new ApiError(400 ,"error in fetching comments")
  }


  
  return res
    .status(200)
    .json(new ApiResponse(200 , allCommentOnAVideo , "comment fetched successfully"))
});

const addComment = asyncHandler(async (req, res) => {
  console.log("erkjgfhbevjdvkebfve");

  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(
      400,
      "Please provide a videoId in which you will add comment"
    );
  }
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(500, "Error in finding userId");
  }
  const { content } = req.body;
  if (!content.trim()) {
    throw new ApiError(400, "Please provide a comment for a video");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });

  const createdComment = await Comment.findById(comment._id).select(
    "-video -owner"
  );

  if (!createdComment) {
    throw new ApiError(400, "Error in creating comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdComment, "Comment Added Successfully"));

  // TODO: add a comment to a video
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { newContent } = req.body;

  if (!commentId) {
    throw new ApiError(400, "Please provide commentId");
  }

  if (!newContent) {
    throw new ApiError(400, "Please provide newContent");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    }
  );

  if (!comment) {
    throw new ApiError(400, "Error in updating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment Updated Successfully"));

  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Please provide commentId");
  }

  const deleteComment = await Comment.deleteOne({ _id: commentId });

  if (!deleteComment) {
    throw new ApiError(400, "Error in deleting comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "Comment deleted successfully"));

  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
