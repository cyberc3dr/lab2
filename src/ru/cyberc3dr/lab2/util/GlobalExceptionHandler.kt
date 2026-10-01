package ru.cyberc3dr.lab2.util

import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.resource.NoResourceFoundException
import ru.cyberc3dr.lab2.LinkNotFoundException
import ru.cyberc3dr.lab2.StorageLimitExceededException
import java.time.Instant

@Schema(description = "Стандартный формат тела ошибки")
data class ErrorResponse(
    @field:Schema(description = "HTTP-статус", example = "404")
    val status: Int,

    @field:Schema(description = "Название ошибки", example = "Not Found")
    val error: String,

    @field:Schema(description = "Человекочитаемое описание причины", example = "Ссылка с id=999 не найдена")
    val message: String,

    @field:Schema(description = "Время возникновения (ISO-8601)", example = "2025-01-15T10:30:00Z")
    val timestamp: String = Instant.now().toString()
)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(LinkNotFoundException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun notFound(ex: LinkNotFoundException) =
        ErrorResponse(404, "Not Found", ex.message ?: "Не найдено")

    @ExceptionHandler(StorageLimitExceededException::class)
    @ResponseStatus(HttpStatus.CONFLICT)
    fun storageFull(ex: StorageLimitExceededException) =
        ErrorResponse(409, "Conflict", ex.message ?: "Хранилище заполнено")

    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun validation(ex: MethodArgumentNotValidException): ErrorResponse {
        val details = ex.bindingResult.fieldErrors
            .joinToString("; ") { "${it.field}: ${it.defaultMessage}" }
        return ErrorResponse(400, "Bad Request", details)
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun unreadable(ex: HttpMessageNotReadableException) =
        ErrorResponse(400, "Bad Request", "Некорректное тело запроса")

    @ExceptionHandler(NoResourceFoundException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun noResource(ex: NoResourceFoundException) =
        ErrorResponse(404, "Not Found", "Ресурс не найден")
}