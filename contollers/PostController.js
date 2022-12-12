import PostModel from "../models/Post.js";

export const createPost = async (req, res) => {
    try {
        const {title, text, location, audioUrl, imageUrl} = req.body;
        const doc = new PostModel({
            title,
            text,
            audioUrl,
            location,
            imageUrl,
            author: req.userId,
            likedBy: [],
        });
        const post = await doc.save();
        return res.json(post);
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось создать пост',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').exec();
        return res.json(posts);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось получить посты',
        })
    }
}

export const getOne = (req, res) => {
    try {
        PostModel.findOneAndUpdate(
            {_id: req.params.id},
            {$inc: {viewsCount: 1}},
            {returnDocument: 'after'},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть пост',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найден',
                    });
                }

                return res.json(doc);
            }
        ).populate('author');
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось получить пост',
        })
    }
}

export const remove = (req, res) => {
    try {
        PostModel.findOneAndDelete(
            {_id: req.params.id},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить пост',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найден',
                    });
                }
                return res.json(doc);
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось удалить пост',
        })
    }
}

export const update = async (req, res) => {
    try {
        const {title, text, location, imageUrl} = req.body;
        await PostModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                title,
                text,
                imageUrl,
                location,
                author: req.userId,
            },
        );
        return res.json({
            ok: 1,
        })
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось обновить пост',
        })
    }
}
