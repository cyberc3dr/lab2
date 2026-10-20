package ru.cyberc3dr.lab2.service

import org.springframework.stereotype.Service
import ru.cyberc3dr.lab2.ForbiddenException
import ru.cyberc3dr.lab2.LinkNotFoundException
import ru.cyberc3dr.lab2.model.Link
import ru.cyberc3dr.lab2.model.LinkRepository
import ru.cyberc3dr.lab2.security.AuthUser

@Service
class LinkService(
    private val repository: LinkRepository
) : GetAllLinksUseCase, GetLinkUseCase, CreateLinkUseCase, UpdateLinkUseCase, DeleteLinkUseCase {

    // Аноним видит только публичные, пользователь — публичные и свои, админ — все
    override fun getAll(actor: AuthUser?): List<Link> = when {
        actor == null -> repository.findByUserIdIsNull()
        actor.isAdmin -> repository.findAll()
        else -> repository.findByUserIdIsNullOrUserId(actor.id)
    }

    override fun getById(id: Long, actor: AuthUser?): Link {
        val link = repository.findById(id).orElseThrow { LinkNotFoundException(id) }
        if (!canView(link, actor)) throw LinkNotFoundException(id)
        return link
    }

    override fun create(actor: AuthUser, title: String, url: String, description: String?, isPublic: Boolean): Link {
        if (isPublic && !actor.isAdmin) {
            throw ForbiddenException("Публичные ссылки может создавать только администратор")
        }
        return repository.save(
            Link(
                id = 0L,
                title = title.trim(),
                url = url.trim(),
                description = description?.trim()?.ifBlank { null },
                userId = if (isPublic) null else actor.id
            )
        )
    }

    override fun update(actor: AuthUser, id: Long, title: String, url: String, description: String?): Link {
        val existing = getById(id, actor)
        requireModify(existing, actor)
        val updated = existing.copy(
            title = title.trim(),
            url = url.trim(),
            description = description?.trim()?.ifBlank { null }
        )
        return repository.save(updated)
    }

    override fun delete(actor: AuthUser, id: Long) {
        val existing = getById(id, actor)
        requireModify(existing, actor)
        repository.delete(existing)
    }

    private fun canView(link: Link, actor: AuthUser?): Boolean = when {
        link.userId == null -> true
        actor == null -> false
        actor.isAdmin -> true
        else -> link.userId == actor.id
    }

    private fun requireModify(link: Link, actor: AuthUser) {
        if (actor.isAdmin) return
        // Чужая приватная ссылка не видна — сообщаем как об отсутствующей
        if (link.userId != actor.id) throw LinkNotFoundException(link.id)
        // Публичную ссылку обычный пользователь не может изменять
        if (link.userId == null) throw ForbiddenException("Публичную ссылку может изменять только администратор")
    }
}
