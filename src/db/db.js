import mongoose from "mongoose";
import { Tanush_DB } from "./constant.js";

const connectDB = async () => {
    try{
        const uri = `${process.env.MONGODB_URI}/${Tanush_DB}`
        const ConnectionInstance = await mongoose.connect(uri);
        console.log(`mongoDB connected: ${ConnectionInstance.connection.host}`)
    }
    catch(error){
        console.log("error in db connection",error)
        process.exit(1);
    }
}


export default connectDB;
