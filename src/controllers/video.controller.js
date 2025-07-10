import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const allPublicVideos = asyncHandler( async (req ,res) => {

    const videos = await Video.find({ ispublished : true}).populate('owner','avatar username')

    if(videos.length === 0){
        throw new ApiError(404,"No public Videos");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,videos,"Public Videos")
    )
})

const getAllVideos = asyncHandler(async (req, res) => {
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const user = req.user?._id;
    
    if(!user){
        throw new ApiError(404,"User not found");
    }
    
    const videos = await Video.find({ owner: user  }).select("-__v"); 

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Fetched all user videos") 
        );
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
    const { videoId } = req.params;
    //TODO: get video by id
    if(!videoId){
        throw new ApiError(400,"Unable to get Video");
    }

    const getVideoById = await Video.findById(videoId).select("-__v");

    return res
    .status(200)
    .json(
        new ApiResponse(200, getVideoById , "video is returned")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    //TODO: update video details like title, description, thumbnail
    const { title , description } = req.body;

    if(!(title && description)){
        throw new ApiError(404, "all fields are mandatory")
    }
   
    let thumbnailLocalPath;

    if(req.file?.path){
        thumbnailLocalPath = req.file.path;
    }

    const thumbnailUploadOnCloudinary = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : { url : ""}; 
    
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set : {
                title : title,
                description : description,
                thumbnail : thumbnailUploadOnCloudinary.url || ""
            }
        },
        { 
            new : true
        }
    )

    
    return res
    .status(200).json(
        new ApiResponse(200 , updatedVideo ,"Video Updated Success")
    )
})  

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    const deleteVideo = await Video.findByIdAndDelete(videoId);
    
    if(deleteVideo == null){    
        throw new ApiError(404,"Error in deleting Video");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Deleted Successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if(!video){
        new ApiError(404,"Video not Found");
    }

    video.ispublished = !video.ispublished;
    await video.save({ validateBeforeSave : false });

    return res
    .status(200)
    .json( 
        new ApiResponse(200,video,"status toggled Successfully")
    )
})

export {
    getAllVideos, 
    publishAVideo, 
    getVideoById, 
    updateVideo, 
    deleteVideo, 
    togglePublishStatus,
    allPublicVideos 
}