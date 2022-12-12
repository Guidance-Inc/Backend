import {body} from 'express-validator';

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не меньше 5 символов').isLength({min: 5}),
    body('nickname', 'Укажите никнейм').isLength({min: 1}),
    body('avatarUrl', 'Ссылка на аватар неверная').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не меньше 5 символов').isLength({min: 5}),
]