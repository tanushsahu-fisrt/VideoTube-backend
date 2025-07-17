import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"Invalid Video Id")
    }
    
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(404,"User id not found")
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        await Like.deleteOne({ _id : existingLike._id });
        
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Unliked video")
        );
    }

    const likedVideo = await Like.create({ 
        video: videoId, 
        likedBy: userId 
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200,likedVideo,"liked Video successfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        throw new ApiError(404,"Invalid Comment Id")
    }
    
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(404,"User id not found")
    }
    
    const existingCommnetLike = await Like.findOne({ comment : commentId , likedBy : userId })

    if(existingCommnetLike){
        await Like.deleteOne({ _id : existingCommnetLike._id })

        return res
        .status(200)
        .json(
            new ApiResponse(200, {} ,"Unliked Comment")
        )
    }

    const commentOnVideo = await Like.create({
        comment : commentId,
        likedBy : userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, commentOnVideo ,"liked Comment")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"Invalid Tweet Id")
    }
    
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(404,"User id not found")
    }

    const existingTweetLike = await Like.findOne({ tweet : tweetId , likedBy : userId })

    if(existingTweetLike){
        await Like.deleteOne({ _id : existingTweetLike._id })

        return res
        .status(200)
        .json(
            new ApiResponse(200, {} ,"Unliked tweet")
        )
    }

    const likedTweet = await Like.create({
        tweet : tweetId,
        likedBy : userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, likedTweet ,"liked tweet successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(404,"User id not found")
    }

    const GetAllLikedVideo = await Like.find({ 
        likedBy : userId ,
        video : {
            $exists : true
        }
    }).populate({
        path : "video",
        select : "-__v",
        populate : {
            path : "owner",
            select : "avatar username"
        }
    })
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, GetAllLikedVideo ,"Fetched all liked videos")
    )
})

const getLikedTweets = asyncHandler( async(req ,res) => {
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(404 , 'user id is required');
    }

    const GetAllLikedTweet = await Like.find({
        likedBy : userId,
        tweet : {
            $exists : true,
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, GetAllLikedTweet ,"Fetched all liked tweet")
    )
    
})

const getLikedComments = asyncHandler( async(req ,res) => {

    const userId = req.user._id;

    if(!userId){
        throw new ApiError(404,'user id is required');
    }

    const GetAllLikedComment = await Like.find({
        likedBy : userId,
        comment : {
            $exists : true,
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, GetAllLikedComment ,"Fetched all liked tweet")
    )
    
})

const checkIsLiked = asyncHandler( async(req ,res) => {
    const userId = req.user._id;

    const { videoId } = req.params;

    if(!userId){
        throw new ApiError(404 , 'user id is required');
    }

    const isLiked = await Like.exists({
        video : videoId,
        likedBy : userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, !!isLiked ,"checked Is Liked")
    )
    
})



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedTweets,
    checkIsLiked,
    getLikedComments
}