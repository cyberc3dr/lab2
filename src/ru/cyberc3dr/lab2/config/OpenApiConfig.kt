package ru.cyberc3dr.lab2.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun linksOpenApi() : OpenAPI = OpenAPI().info(
        Info()
            .title("Links Service API")
            .description("REST CRUD сервис для управления ссылками. " +
                         "Хранилище в памяти. 50 записей.")
            .version("1.0.0")
    )
}