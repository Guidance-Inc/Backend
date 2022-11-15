## Posts

Интерфейс поста (IPost):
```
{
    text: String // Текст поста
    title: String // Название поста
    imageUrl: String // Ссылка на изображение
}
```


GET /posts - Получение всех постов, в ответе IPost[]

---
POST /posts - Создание поста

body:
```
{
    text?: String // Текст поста, необязательно
    title: String // Название поста
    imageUrl?: String // Ссылка на изображение, необязательно
}
```

---
GET /posts/:id - Получение поста по id, IPost

DELETE /posts/:id - Удаление поста по id, IPost

PATCH /posts/:id - Изменение поста по id, IPost



## User

```
{
    fullName: String // Полное имя
    email: String // email
    avatarUrl: String // ссылка на аватар
}
```

*Эндпоинтов пока нет*

## Регистрация, аутентификация

POST /auth/register - Регистрация

body:
```
{
    email: String
    password: String // Минимум 5 символов
    fullName: String
    avatarUrl?: String // Необязательно
}
```

POST /auth/login - Логин

body:
```
{
    email: String
    password: String // Минимум 5 символов
}
```


