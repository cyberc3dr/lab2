package ru.cyberc3dr.lab2.rest

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.cyberc3dr.lab2.InvalidCredentialsException
import ru.cyberc3dr.lab2.UnauthorizedException
import ru.cyberc3dr.lab2.UsernameAlreadyExistsException
import ru.cyberc3dr.lab2.model.Role
import ru.cyberc3dr.lab2.model.User
import ru.cyberc3dr.lab2.model.UserRepository
import ru.cyberc3dr.lab2.security.JwtService
import ru.cyberc3dr.lab2.security.authUser

@Tag(name = "Auth API", description = "Регистрация, вход и информация о текущем пользователе")
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val users: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    @Operation(summary = "Регистрация нового пользователя (роль USER)")
    @ApiResponses(
        ApiResponse(responseCode = "201", description = "Пользователь создан, возвращён токен"),
        ApiResponse(responseCode = "400", description = "Ошибка валидации"),
        ApiResponse(responseCode = "409", description = "Логин уже занят")
    )
    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        val username = request.username.trim().lowercase()
        if (users.existsByUsername(username)) throw UsernameAlreadyExistsException(username)
        val user = users.save(
            User(
                id = 0L,
                username = username,
                password = passwordEncoder.encode(request.password) ?: error("Не удалось зашифровать пароль"),
                role = Role.USER
            )
        )
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(AuthResponse(jwtService.issue(user), user.id, user.username, user.role))
    }

    @Operation(summary = "Вход по логину и паролю, возвращает JWT")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Успешный вход"),
        ApiResponse(responseCode = "400", description = "Ошибка валидации"),
        ApiResponse(responseCode = "401", description = "Неверный логин или пароль")
    )
    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        val username = request.username.trim().lowercase()
        val user = users.findByUsername(username)
        if (user == null || !passwordEncoder.matches(request.password, user.password)) {
            throw InvalidCredentialsException()
        }
        return ResponseEntity.ok(AuthResponse(jwtService.issue(user), user.id, user.username, user.role))
    }

    @Operation(summary = "Текущий аутентифицированный пользователь",
        security = [SecurityRequirement(name = "bearerAuth")])
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Данные пользователя"),
        ApiResponse(responseCode = "401", description = "Не аутентифицирован")
    )
    @GetMapping("/me")
    fun me(): ResponseEntity<MeResponse> {
        val actor = SecurityContextHolder.getContext().authentication.authUser()
            ?: throw UnauthorizedException("Требуется аутентификация")
        return ResponseEntity.ok(MeResponse(actor.id, actor.username, actor.role))
    }
}
