import CommentModel from "../models/Comment.js";

export const createComment = async (req, res) => {
	try {
		const {text} = req.body;
		const doc = new CommentModel({
			text,
			author: req.userId,
		});
		const comment = await doc.save();
		return res.json(comment);
	} catch (e) {
		return res.status(500).json({
			message: 'Не удалось создать комментарий',
		})
	}
}

// TODO:
export const getAllCommentsByUserId = async (req, res) => {
	try {
		const comments = await CommentModel.find().populate('author').exec();
		return res.json(comments);
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			message: 'Не удалось получить комментарии',
		})
	}
}

export const getCommentById = async (req, res) => {
	try {
		const comment = await CommentModel.findOne({_id: req.params.id});
		if (!comment) {
			return res.status(404).json({
				message: 'Комментарий не найден',
			});
		}
		comment.populate('author');
		return res.json(comment);
	} catch (e) {
		return res.status(500).json({
			message: 'Не удалось получить комментарий',
		})
	}
}

export const remove = (req, res) => {
	try {
		CommentModel.findOneAndDelete(
			{_id: req.params.id},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: 'Не удалось удалить комментарий',
					});
				}
				if (!doc) {
					return res.status(404).json({
						message: 'Комментарий не найден',
					});
				}
				return res.json(doc);
			}
		);
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			message: 'Не удалось удалить комментарий',
		})
	}
}

export const update = async (req, res) => {
	try {
		const {text} = req.body;
		await CommentModel.findOneAndUpdate(
			{_id: req.params.id},
			{
				text,
				author: req.userId,
			},
		);
		return res.json({
			ok: 1,
		})
	} catch (e) {
		return res.status(500).json({
			message: 'Не удалось обновить комментарий',
		})
	}
}
