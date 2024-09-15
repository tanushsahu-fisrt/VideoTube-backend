// require('dotenv').config({path: './env'})


import dotenv from "dotenv";
import connectDB from "./db/db.js";


dotenv.config({
    path: './env'
})

connectDB()












/*
import express from expreess;
const app = express();

( async () => {
    try{
         await mongoose.connect(`${process.env.MONGODB_URI}/${tanushDB}`);
         app.on("error",(error) => {
             console.log("connection error")
             throw error;
         })

         app.listen(process.env.PORT , () => {
            console.log(`server is running on port ${process.env.PORT}`)
         })

    }catch (error){
        console.log(error);
        throw Error;
    }
})()
*/