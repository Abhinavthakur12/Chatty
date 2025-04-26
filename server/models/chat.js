import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const schema = new Schema({
    name:
    {
        type: String,
        required: true
    },
    groupChat: {
        type: Boolean,
        default:false
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    members:[{
        type: mongoose.Types.ObjectId,
        ref:"User"
    }]
}, {
    timestamps: true
})

export const Chat = models.Chat || model("Chat", schema)