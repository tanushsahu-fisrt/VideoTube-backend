import {v2 as cloudinary} from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = uploadOnCloudinary = async (localfilepath) => {
    try{
        if(!localfilepath) return null;

        //upload the file in cloudinary
        cloudinary.upload.upload(localfilepath, {
            resource_type: "auto"
        })

        //file has been upoaded
        console.log("file is uploaded on cloudinary",
        resource.url);
        return response;
    }
    catch(error){
        fs.upLinkSync(localfilepath)
        return null;
    }
}

export{upload}


