import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const schema = new Schema({
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
}
    , {
    timestamps: true
})

export const Request = models.Request || model("Request", schema)