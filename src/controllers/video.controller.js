import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    // TODO: get video, upload to cloudinary, create video
    if(!(title && description)){
        throw new ApiError(404,"Title and Description is required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    
    let thumbnailLocalPath; 
    if( req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0 ){
        thumbnailLocalPath = req.files.thumbnail[0].path; 
    }

    if(!videoLocalPath){
        throw new ApiError(409 , "Video is required"); 
    }

    const currentUserId = req.user._id;

    if(!currentUserId){
        throw new ApiError(404,"current user is required")
    }

    const uploadVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadThumbnail = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : { url : ""};

    console.log(typeof uploadVideo?.duration)
    
    if(!uploadVideo?.url){
        throw new ApiError(409 , "Video upload faield");
    }

    const videoData = await Video.create({
        videofile : uploadVideo.url,
        thumbnail : uploadThumbnail.url || "",
        title,
        description,
        duration : uploadVideo.duration,
        owner : currentUserId,
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,{ videoData },"Published Successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}