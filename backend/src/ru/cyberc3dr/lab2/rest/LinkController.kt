package ru.cyberc3dr.lab2.rest

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.cyberc3dr.lab2.service.CreateLinkUseCase
import ru.cyberc3dr.lab2.service.DeleteLinkUseCase
import ru.cyberc3dr.lab2.service.GetAllLinksUseCase
import ru.cyberc3dr.lab2.service.GetLinkUseCase
import ru.cyberc3dr.lab2.service.UpdateLinkUseCase
import java.net.URI

@Tag(name = "Links API", description = "CRUD операции с ссылками. Хранилище в памяти. Лимит 50 записей")
@RestController
@RequestMapping("/api/links")
class LinkController(
    private val getAllLinks: GetAllLinksUseCase,
    private val getLink: GetLinkUseCase,
    private val createLink: CreateLinkUseCase,
    private val updateLink: UpdateLinkUseCase,
    private val deleteLink: DeleteLinkUseCase
) {

    @Operation(summary = "Получить все ссылки")
    @ApiResponse(responseCode = "200", description = "Список ссылок (может быть пустым)")
    @GetMapping
    fun getAll() : ResponseEntity<List<LinkResponse>> =
        ResponseEntity.ok(getAllLinks.getAll().map { it.toResponse() })

    @Operation(summary = "Получить ссылку по id")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Ссылка найдена"),
        ApiResponse(responseCode = "404", description = "Ссылка не найдена")
    )
    @GetMapping("/{id}")
    fun getById(@Parameter(description = "Идентификатор ссылки") @PathVariable id: Long): ResponseEntity<LinkResponse> =
        ResponseEntity.ok(getLink.getById(id).toResponse())

    @Operation(summary = "Создать ссылку")
    @ApiResponses(
        ApiResponse(responseCode = "201", description = "Ссылка создана"),
        ApiResponse(responseCode = "400", description = "Ошибка валидации"),
        ApiResponse(responseCode = "409", description = "Хранилище заполнено (50/50)")
    )
    @PostMapping
    fun create(@Valid @RequestBody request: LinkRequest): ResponseEntity<LinkResponse> {
        val created = createLink.create(request.title, request.url, request.description)
        return ResponseEntity
            .created(URI.create("/api/links/${created.id}"))
            .body(created.toResponse())
    }

    @Operation(summary = "Обновить ссылку целиком")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Ссылка обновлена"),
        ApiResponse(responseCode = "404", description = "Ссылка не найдена"),
        ApiResponse(responseCode = "400", description = "Ошибка валидации")
    )
    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: LinkRequest): ResponseEntity<LinkResponse> =
        ResponseEntity.ok(updateLink.update(id, request.title, request.url, request.description).toResponse())

    @Operation(summary = "Удалить ссылку")
    @ApiResponses(
        ApiResponse(responseCode = "204", description = "Ссылка удалена"),
        ApiResponse(responseCode = "404", description = "Ссылка не найдена")
    )
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        deleteLink.delete(id)
        return ResponseEntity.noContent().build()
    }
}