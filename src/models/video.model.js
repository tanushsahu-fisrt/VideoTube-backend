import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema(
    {   
        videofile : {
            type: String,
            require : true,
        },
        thumbnail : {
            type : String,
            require : true,
        },
        title : {
            type : String,
            require : true,
        },
        description : {
            type : String,
            require : true,
        },
        duration : {
            type : String,
            require : true,
        },
        views : {
            type: Number,
            default : 0
        },
        ispublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        timestamps : true
    }
)



export const video = mongoose.model("video",VideoSchema)