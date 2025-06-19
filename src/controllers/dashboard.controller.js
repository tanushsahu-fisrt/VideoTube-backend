import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(404, "User not found");
    }

    const videoStats = await Video.aggregate([
        { 
            $match: { owner: userId } 
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVideos: { $sum: 1 },
                videoIds : { $push: "$_id" }
            }
        }
    ]);

    const { totalViews = 0, totalVideos = 0, videoIds = [] } = videoStats[0] || {};

    // Count total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    // Count total likes on all videos
    const totalLikes = videoIds.length > 0
        ? await Like.countDocuments({ video: { $in: videoIds } })
        : 0 ;

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalViews,
                totalSubscribers,
                totalLikes,
                totalVideos
            },
            "Fetched channel stats"
        )
    )
    
})

const getChannelVideos = asyncHandler( async (req, res) => {
    
    // TODO: Get all the videos uploaded by the channel
    const userid = req.user?._id;
   
    const getAllVideo = await Video.find({ owner : userid}).select(["-__v","-_id"]);

    
    return res
    .status(200)
    .json(
        new ApiResponse(200, getAllVideo , "fetched All Videos")
    )

})

export {
    getChannelStats, 
    getChannelVideos
}