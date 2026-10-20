package ru.cyberc3dr.lab2.config

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.security.SecurityScheme
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    `in` = SecuritySchemeIn.HEADER,
    description = "JWT-токен, полученный в POST /api/auth/login"
)
class OpenApiConfig {

    @Bean
    fun linksOpenApi(): OpenAPI = OpenAPI().info(
        Info()
            .title("Links Service API")
            .description(
                "REST CRUD сервис для управления ссылками с аутентификацией (JWT Bearer). " +
                    "Публичные ссылки доступны анонимно, приватные - владельцу и админу."
            )
            .version("1.0.0")
    )
}
