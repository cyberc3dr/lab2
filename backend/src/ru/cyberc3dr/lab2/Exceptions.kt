package ru.cyberc3dr.lab2

class LinkNotFoundException(val id: Long) :
    RuntimeException("Ссылка с id=$id не найдена")

class StorageLimitExceededException(val limit: Int) :
    RuntimeException("Хранилище заполнено: допустимо не более $limit записей")

class UnauthorizedException(message: String) :
    RuntimeException(message)

class ForbiddenException(message: String) :
    RuntimeException(message)

class UsernameAlreadyExistsException(username: String) :
    RuntimeException("Пользователь '$username' уже существует")

class InvalidCredentialsException :
    RuntimeException("Неверный логин или пароль")