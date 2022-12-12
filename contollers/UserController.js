import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const {email, nickname, avatarUrl} = req.body;
        const doc = new UserModel({
            email,
            nickname,
            avatarUrl,
            passwordHash: hash,
            bio: '',
            followedBy: [],
            following: [],
            comments: [],
            likes: [],
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '30d',
            }
        );

        const {passwordHash, ...userData} = user._doc;

        return res.json({
            ...userData,
            token,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось зарегестрироваться',
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '30d',
            }
        );
        const {passwordHash, ...userData} = user._doc;

        return res.json({
            ...userData,
            token,
        });
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось залогинится',
        })
    }
}

export const authMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        const {passwordHash, ...userData} = user._doc;

        return res.json(userData);
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось'
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({
                message: 'Пользователь с таким ID не найден',
            })
        }
        const {passwordHash, ...userData} = user._doc;
        return res.status(200).json(userData);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось найти пользователя',
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        return res.status(200).json(users);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось найти пользователей',
        })
    }
}

export const deleteUserById = async (req, res) => {
    try {
        UserModel.findOneAndDelete(
            {_id: req.params.id},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить пользователя',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Пользователь не найден',
                    });
                }
                return res.json(doc);
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось удалить пользователя',
        })
    }
}

export const updateUserById = async (req, res) => {
    try {
        const {nickname, email, bio, avatar} = req.body;
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                nickname,
                email,
                avatar,
                bio,
            },
        );
        return res.json({
            ok: 1,
        })
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось обновить пользователя',
        })
    }
}