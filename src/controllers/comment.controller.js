import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"videoId is invalid");
    }

    const getAllComment = await Comment.find({ video : videoId }).limit(limit);

    return res
    .status(200)
    .json(
        new ApiResponse(200,getAllComment,"fetched all comment successfully")
    )


})

const addComment = asyncHandler(async (req, res) => {

    const {videoId} = req.params;
    // TODO: add a comment to a video
    const { content } = req.body;

    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "Video Id is invalid")
    }

    if(!content){
        throw new ApiError(404, "comment content is needed")
    }

    const userId = req.user._id;

    if(!userId){
        throw new ApiError(404, "UserId is required")
    }

    const createComment = await Comment.create({
        content,
        video : videoId,
        owner : userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,createComment,"added comment successfully")
    )

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment   
    const { commentId } = req.params;

    const { content } = req.body;

    if(!isValidObjectId(commentId)){
        throw new ApiError(404, "commentId is invalid")
    }

    if(!content){
        throw new ApiError(404, "comment content is needed")
    }

    const updateComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set : {
                content : content,
            }
        },
        { new : true}
    ).select("-__v")

    return res
    .status(200)
    .json(
        new ApiResponse(200,updateComment,"Updated comment successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    if(!isValidObjectId(commentId)){
        throw new ApiError(404, "commentId is invalid")
    }

    const deleteComment = await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Deleted comment successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }