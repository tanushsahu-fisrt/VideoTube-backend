import { ApiError } from "../utils/ApiError.js";
import { asyncHandler }  from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res) => {
    
    const { fullName , email , username , password } = req.body;

    if(
        [ fullName, email, username, password].some( (field) => field?.trim() === "")
    ) {
        throw new ApiError(404 ,"All fields are required")
    }

    const existedUser = User.findOne({
        $or : [ { username} , {email} ]
    })

    if(existedUser){
        throw new ApiError(409 , "User with email or Username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(avatarLocalPath){
        throw new ApiError(409 , "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(409 , "Avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowercase(),

    })

    const createdUser = User.findById(user._id).select( 
        "-password -refrenceToken"  // here - sign indicates which field we do not want
    )

    if(!createdUser) {
        throw new ApiError(409 , "Something went Wrong While registering user");
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser , "User Registered Successfully")
    )
})

export { registerUser }