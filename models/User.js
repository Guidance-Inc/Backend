import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    followedBy: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        default: [],
    },
    bio: {
        type: String,
        default: '',
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }],
        default: [],
    },
    avatarUrl: String,
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);