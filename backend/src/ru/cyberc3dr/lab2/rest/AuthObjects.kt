package ru.cyberc3dr.lab2.rest

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import ru.cyberc3dr.lab2.model.Role

@Schema(description = "Данные для регистрации")
data class RegisterRequest(
    @field:NotBlank(message = "Логин обязателен")
    @field:Size(min = 3, max = 50, message = "Логин - от 3 до 50 символов")
    @field:Schema(description = "Логин нового пользователя", example = "ivan")
    val username: String = "",

    @field:NotBlank(message = "Пароль обязателен")
    @field:Size(min = 6, max = 100, message = "Пароль - от 6 до 100 символов")
    @field:Schema(description = "Пароль", example = "secret1")
    val password: String = ""
)

@Schema(description = "Данные для входа")
data class LoginRequest(
    @field:NotBlank(message = "Логин обязателен")
    @field:Schema(description = "Логин", example = "user")
    val username: String = "",

    @field:NotBlank(message = "Пароль обязателен")
    @field:Schema(description = "Пароль", example = "user123")
    val password: String = ""
)

@Schema(description = "Результат входа/регистрации: JWT-токен и данные пользователя")
data class AuthResponse(
    @field:Schema(description = "JWT-токен для заголовка Authorization: Bearer", example = "eyJhbGciOi...")
    val token: String,

    @field:Schema(description = "ID пользователя", example = "1")
    val id: Long,

    @field:Schema(description = "Логин", example = "user")
    val username: String,

    @field:Schema(description = "Роль", example = "USER")
    val role: Role
)

@Schema(description = "Данные текущего аутентифицированного пользователя")
data class MeResponse(
    @field:Schema(description = "ID пользователя", example = "1")
    val id: Long,

    @field:Schema(description = "Логин", example = "user")
    val username: String,

    @field:Schema(description = "Роль", example = "USER")
    val role: Role
)
