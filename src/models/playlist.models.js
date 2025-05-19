import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name:{
        type:toString,
        required:true
    },
    description:{
        type:toString,
        required:true
    },
    video:[
        {
        type:Schema.Types.ObjectId,
        ref:"Video"
        }
    ],
    owner:{
         type:Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true})


export const Playlist = mongoose.model("Playlist", playlistSchema)