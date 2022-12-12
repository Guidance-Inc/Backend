import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: String,
        viewsCount: {
            type: Number,
            default: 0,
        },
        location: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        imageUrl: String,
        audioUrl: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Post', PostSchema);