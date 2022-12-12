import express from 'express';
import mongoose from "mongoose";
import {loginValidation, registerValidation} from "./validations/auth.js";
import {createPostValidation} from "./validations/posts.js";
import {checkAuth} from "./utils/checkAuth.js";
import * as UserController from "./contollers/UserController.js";
import * as PostController from "./contollers/PostController.js";
import * as CommentController from "./contollers/CommentController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.resolve('./uploads')));
app.use(cors());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync(path.resolve('./uploads'))) {
            fs.mkdirSync(path.resolve('./uploads'));
        }
      cb(null, path.resolve('./uploads'));
    },
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
})

const upload = multer({storage});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected'))
    .catch(() => console.log('DB error'))

// Upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    return res.json({
       url: `/uploads/${req.file.originalname}`,
    });
});
// Auth
app.get('/auth/me', checkAuth, UserController.authMe)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)

// Posts
app.post('/posts', checkAuth, createPostValidation, handleValidationErrors, PostController.createPost);
app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, createPostValidation, handleValidationErrors, PostController.update);

// Users
app.get('/users', UserController.getAllUsers);
app.get('/users/:id', UserController.getUserById);
app.delete('/users/:id', checkAuth, handleValidationErrors, UserController.deleteUserById);
app.patch('/users/:id', checkAuth, handleValidationErrors, UserController.updateUserById);

// Comments
app.post('/comments', checkAuth, createCommentValidation, handleValidationErrors, CommentController.createComment);
app.get('/comments/:id', CommentController.getCommentById);
app.delete('/comments/:id', checkAuth, CommentController.remove);
app.patch('/comments/:id', checkAuth, createCommentValidation, handleValidationErrors, CommentController.update);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) return console.log(err);
    console.log('Server is running');
})