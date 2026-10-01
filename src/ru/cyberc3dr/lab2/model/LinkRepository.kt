package ru.cyberc3dr.lab2.model

interface LinkRepository {
    fun findAll(): List<Link>
    fun findById(id: Long): Link?
    fun save(link: Link): Link
    fun update(link: Link): Link?
    fun deleteById(id: Long): Boolean
    fun count(): Int
}