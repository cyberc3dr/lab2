package ru.cyberc3dr.lab2.rest

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import ru.cyberc3dr.lab2.model.Link
import java.time.Instant

@Schema(description = "Стандартный формат запроса на создание ссылки")
data class LinkRequest(
    @field:NotBlank(message = "Заголовок обязателен")
    @field:Size(max = 100, message = "Заголовок - не длиннее 100 символов")
    @field:Schema(description = "Заголовок ссылки", example = "Title")
    val title: String = "",

    @field:NotBlank(message = "URL обязателен")
    @field:Pattern(regexp = "^https?://.+", message = "URL должен начинаться с http:// или https://")
    @field:Schema(description = "URL", example = "https://example.com")
    val url: String = "",

    @field:Size(max = 300, message = "Описание - не длиннее 300 символов")
    @field:Schema(description = "Описание ссылки", example = "Description")
    val description: String? = null
)

@Schema(description = "Стандартный формат ответа ссылки")
data class LinkResponse(
    @field:Schema(description = "ID ссылки", example = "0")
    val id: Long,

    @field:Schema(description = "Заголовок ссылки", example = "Title")
    val title: String,

    @field:Schema(description = "URL", example = "https://example.com")
    val url: String,

    @field:Schema(description = "Описание ссылки", example = "Description")
    val description: String?,

    @field:Schema(description = "Время создания (ISO-8601)", example = "2025-01-15T10:30:00Z")
    val createdAt: Instant
)

fun Link.toResponse() = LinkResponse(id, title, url, description, createdAt)