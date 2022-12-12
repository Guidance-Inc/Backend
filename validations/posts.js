import {body} from 'express-validator';

export const createPostValidation = [
    body('title', 'Заголовок должен быть не менее 1 символа').isLength({min: 1}),
    body('text', 'Текст должен быть строкой').optional().isString(),
    body('imageUrl', 'Неверная ссылка на картинку').optional().isString(),
    body('location', 'В location должно быть ровно два числа').optional().isArray({min: 2, max: 2}),
]