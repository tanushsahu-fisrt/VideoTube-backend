import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilepath) => {
    
    try{
        
        if(!localfilepath) return null;

        //upload the file in cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
        }) 
  
        //file has been upoaded
       fs.unlinkSync(localfilepath)
        return response;
    }
    catch(error){
        fs.unlinkSync(localfilepath) //remove the locally saved temp file as the operation got failed
        return null;
    }
}

export { uploadOnCloudinary } 


