package ru.cyberc3dr.lab2.service

import org.springframework.stereotype.Service
import ru.cyberc3dr.lab2.LinkNotFoundException
import ru.cyberc3dr.lab2.model.Link
import ru.cyberc3dr.lab2.model.LinkRepository

@Service
class LinkService(
    private val repository: LinkRepository
) : GetAllLinksUseCase, GetLinkUseCase, CreateLinkUseCase, UpdateLinkUseCase, DeleteLinkUseCase {

    override fun getAll() = repository.findAll()

    override fun getById(id: Long): Link = repository.findById(id).orElseThrow { LinkNotFoundException(id) }

    override fun create(title: String, url: String, description: String?) =
        repository.save(Link(id = 0L, title = title, url = url, description = description))

    override fun update(id: Long, title: String, url: String, description: String?): Link {
        val existing = getById(id)
        val updated = existing.copy(
            title = title,
            url = url,
            description = description?.trim()?.ifBlank { null }
        )

        return repository.save(updated)
    }

    override fun delete(id: Long) {
        val success = runCatching { repository.deleteById(id) }.isSuccess

        if(!success) throw LinkNotFoundException(id)
    }
}