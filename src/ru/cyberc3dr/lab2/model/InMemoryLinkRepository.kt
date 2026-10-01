package ru.cyberc3dr.lab2.model

import org.springframework.stereotype.Repository
import ru.cyberc3dr.lab2.StorageLimitExceededException
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicLong

@Repository
class InMemoryLinkRepository : LinkRepository {

    companion object {
        const val MAX_SIZE = 50
    }

    private val storage = ConcurrentHashMap<Long, Link>()
    private val idGenerator = AtomicLong(0)

    override fun findAll() = storage.values.sortedBy { it.id }

    override fun findById(id: Long) = storage[id]

    override fun save(link: Link) = synchronized(this) {
        if (storage.size >= MAX_SIZE) throw StorageLimitExceededException(MAX_SIZE)
        val id = idGenerator.incrementAndGet()
        val saved = link.copy(id = id)
        storage[id] = saved
        saved
    }

    override fun update(link: Link) = synchronized(this) {
        if(storage.containsKey(link.id)) {
            storage[link.id] = link
            link
        } else null
    }

    override fun deleteById(id: Long) = storage.remove(id) != null

    override fun count() = storage.size
}