package ru.cyberc3dr.lab2.service

import ru.cyberc3dr.lab2.model.Link

interface GetAllLinksUseCase {
    fun getAll() : List<Link>
}

interface GetLinkUseCase {
    fun getById(id: Long): Link
}

interface CreateLinkUseCase {
    fun create(title: String, url: String, description: String?): Link
}

interface UpdateLinkUseCase {
    fun update(id: Long, title: String, url: String, description: String?): Link
}

interface DeleteLinkUseCase {
    fun delete(id: Long)
}