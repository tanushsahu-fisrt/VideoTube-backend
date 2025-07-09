import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body; 

    if(!content){
        throw new ApiError(404,"Tweet content is empty");
    }

    const user = req.user?._id;

    if(!user){
        throw new ApiError(404,"Unable to get User");
    }

    const postTweet = await Tweet.create({
        content,
        owner : user
    })

    if(!postTweet){
        throw new ApiError(404,"Unable to Create Tweet");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,postTweet,"Tweet created")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    if(!userId){
        throw new ApiError(404,"Unable to get User");
    }

    const userTweet = await Tweet.find({ owner : userId });

    if(userTweet.length === 0){
       return res
        .status(200)
        .json(
        new ApiResponse(200,userTweet,"No tweets by the user")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,userTweet,"user Tweet fetched")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body;
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"Tweet Id is undefined");
    }

    if(!content){
        throw new ApiError(404,"Unable to get Tweet content");
    }

    const updateTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set : {
                    content : content
                }
            },
            { new : true}
    )

    if(!updateTweet){
        throw new ApiError("Unable to Update Tweet");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updateTweet,"Tweet Updated")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"Tweet Id is invalid");
    }

    const deleteTweet = await Tweet.findByIdAndDelete(tweetId);

    if(!deleteTweet){
        throw new ApiError("Unable to Delete Tweet");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Tweet Deleted")
    )
})


const getAllTweets = asyncHandler( async (req ,res) => {

    const tweets = await Tweet.find({})
    .sort({ createdAt : -1 })
    .populate('owner','username avatar');

    if(!tweets){
        throw new ApiError(404,'error in fetching tweets')
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200,tweets,"Tweet fetched")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}