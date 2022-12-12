import {body} from 'express-validator';

export const createCommentValidation = [
	body('text', 'Текст должен быть строкой').optional().isString().isLength({min: 1}),
]