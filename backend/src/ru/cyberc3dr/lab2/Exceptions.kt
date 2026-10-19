package ru.cyberc3dr.lab2

class LinkNotFoundException(val id: Long) :
    RuntimeException("Ссылка с id=$id не найдена")

class StorageLimitExceededException(val limit: Int) :
    RuntimeException("Хранилище заполнено: допустимо не более $limit записей")