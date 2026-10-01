package ru.cyberc3dr.lab2.model

import java.time.Instant

data class Link(
    val id: Long,
    val title: String,
    val url: String,
    val description: String? = null,
    val createdAt: Instant = Instant.now()
)
