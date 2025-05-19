import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const ownerId = req.user?._id;
  if (!ownerId) {
    throw new ApiError(404, "User Id not found");
  }
  if (!(title && description)) {
    throw new ApiError(400, "send both title and description");
  }

  const videoLocalFilePath = await req.files?.videoFile[0]?.path;
  if (!videoLocalFilePath) {
    throw new ApiError(404, "Video not found");
  }

  const videoRes = await uploadOnCloudinary(videoLocalFilePath);
  if (!videoRes) {
    throw new ApiError(400, "Video is required");
  }

  const thumbnailLocalFilePath = await req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalFilePath) {
    throw new ApiError(404, "Thumbnail not found");
  }

  const thumbnailRes = await uploadOnCloudinary(thumbnailLocalFilePath);
  if (!thumbnailRes) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFile = await Video.create({
    videoFile: videoRes.secure_url,
    thumbnail: thumbnailRes.secure_url,
    title,
    description,
    owner: ownerId,
  });

  const createdVideo = await Video.findById(videoFile._id);
  if (!createdVideo) {
    throw new ApiError(404, "Created video not found ");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdVideo, "Video uploaded successFully"));
  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (req, res) => {
  console.log("coming here");

  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "Id not found");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const video = await Video.findById(videoId).select(
    "-thumbnail -title -description  "
  );

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video found successfully"));
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!(title || description)) {
    throw new ApiError(400, "Send atleast one thing to update");
  }

  const thumbnailLocalFilePath = await req.file?.path;

  if (!thumbnailLocalFilePath) {
    throw new ApiError(400, "thumbnail not found on multer");
  }

  const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalFilePath)
    .secure_url;

    const object = {
        thumbnail : thumbnailUrl,
        description,
        title
    }

  const videoFile = await Video.updateOne(
    { _id: videoId },
    {
      $set: {
        object
      },
    }
  );

  if (!videoFile) {
    throw new ApiError(400, "Error on updating Files");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoFile, "Updated successfully"));
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id not found");
  }

  const deletedVideo =await Video.deleteOne({ _id: videoId });
  if (!deletedVideo) {
    throw new ApiError(400, "Error in deleting video");
  }

  return res.status(200).json(200,  "Video deleted successfully");
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if(!videoId){
    throw new ApiError(400, "Video Id not found")
  }

  const videoFile = await Video.findById(videoId).select("-videoFile -thumbnail -title -description");

  if(!videoFile){
    throw new ApiError("Error in finding videofile");
    
  }

let status ;
  if(videoFile.isPublished){
        status = false
  }else{
    status = true
  }

  const toggle =await Video.updateOne({_id : videoId},{
    $set :{
        isPublished :status
    }
  })

  if(!toggle){
    throw new ApiError(400 , "Error in toggling");
  }

  return res.status(200)
  .json(new ApiResponse(200 , toggle , "Published status toggled succcessfully"))
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
