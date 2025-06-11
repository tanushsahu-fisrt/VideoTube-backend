import mongoose from "mongoose";
// import { Tanush_DB } from ".db/constant.js"

const connectDB = async ()=>{
    try{
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.Tanush_DB}`);
        console.log(`mongoDB connected: ${ConnectionInstance.connection.host}`)

    }
    catch(error){
        console.log("error in db connection",error)
        process.exit(1)
    }
}


export default connectDB

