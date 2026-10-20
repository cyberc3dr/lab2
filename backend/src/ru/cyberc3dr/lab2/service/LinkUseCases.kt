package ru.cyberc3dr.lab2.service

import ru.cyberc3dr.lab2.model.Link
import ru.cyberc3dr.lab2.security.AuthUser

interface GetAllLinksUseCase {
    fun getAll(actor: AuthUser?): List<Link>
}

interface GetLinkUseCase {
    fun getById(id: Long, actor: AuthUser?): Link
}

interface CreateLinkUseCase {
    fun create(actor: AuthUser, title: String, url: String, description: String?, isPublic: Boolean): Link
}

interface UpdateLinkUseCase {
    fun update(actor: AuthUser, id: Long, title: String, url: String, description: String?): Link
}

interface DeleteLinkUseCase {
    fun delete(actor: AuthUser, id: Long)
}
