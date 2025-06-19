import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


// TODO: toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
    
    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(404,"Channel id is not valid");
    }

    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(404,"User not found")
    }

    const existingSubscriber = await Subscription.findOne({ 
        subscriber : userId,
        channel : channelId
    })

    if(existingSubscriber){
        const deleteExistingSubscriber =  await Subscription.deleteOne({ _id : existingSubscriber?._id })

        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"existing subscriber deleted")
        )
    }

    const createSubscriber = await Subscription.create({
        subscriber : userId,
        channel : channelId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, createSubscriber ,"Subscriber Created")
    )

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params;

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(404,"Channel id is not valid");
    }

    const channelSubscribers = await Subscription.find({ subscriber : subscriberId })

    return res
    .status(200)
    .json(
        new ApiResponse(200, channelSubscribers ,"fetched subscriber list of channel")
    )

})

// controller to return channel list to which user has subscribed 
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(404,"Channel id is not valid");
    }

    const userChannelSubscribers = await Subscription.find({ channel : channelId })

    return res
    .status(200)
    .json(
        new ApiResponse(200, userChannelSubscribers ,"Fetched list of channels subscribed by the user")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}